{
  description = "LibreStock Inventory System Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    rust-overlay,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        overlays = [(import rust-overlay)];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        # Python with mkdocs packages
        pythonEnv = pkgs.python312.withPackages (ps:
          with ps; [
            mkdocs-material
            mkdocs-git-revision-date-localized-plugin
            pymdown-extensions
          ]);

        # Rust toolchain
        rustToolchain = pkgs.rust-bin.stable.latest.default;

        # Process-compose configuration for services
        processComposeConfig = pkgs.writeText "process-compose.yaml" ''
          version: "0.5"

          environment:
            PGDATABASE: librestock_inventory
            PGHOST: 127.0.0.1
            PGPORT: "5432"

          processes:
            postgres:
              command: |
                PGDATA="$PWD/.postgres/data"
                if [ ! -d "$PGDATA" ]; then
                  mkdir -p "$PGDATA"
                  initdb -D "$PGDATA" --no-locale --encoding=UTF8
                  echo "unix_socket_directories = '$PWD/.postgres'" >> "$PGDATA/postgresql.conf"
                  echo "listen_addresses = '127.0.0.1'" >> "$PGDATA/postgresql.conf"
                  echo "port = 5432" >> "$PGDATA/postgresql.conf"
                fi
                mkdir -p "$PWD/.postgres"
                pg_ctl -D "$PGDATA" -l "$PWD/.postgres/postgres.log" -o "-k $PWD/.postgres" start
                sleep 2
                createdb -h "$PWD/.postgres" librestock_inventory 2>/dev/null || true
                tail -f "$PWD/.postgres/postgres.log"
              shutdown:
                command: pg_ctl -D "$PWD/.postgres/data" stop
                timeout_seconds: 10
              readiness_probe:
                exec:
                  command: pg_isready -h 127.0.0.1 -p 5432
                initial_delay_seconds: 2
                period_seconds: 2

            api:
              command: cd modules/api && pnpm start:dev
              depends_on:
                postgres:
                  condition: process_healthy

            web:
              command: cd modules/web && pnpm dev
              depends_on:
                postgres:
                  condition: process_healthy

            docs:
              command: mkdocs serve -a 127.0.0.1:8000
              availability:
                restart: "no"
        '';
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # JavaScript/Node.js
            nodejs_24
            pnpm_10
            typescript
            nodePackages.prettier

            # Python
            pythonEnv

            # Rust
            rustToolchain

            # Database
            postgresql_16

            # Build tools
            just
            docker
            docker-compose
            pkg-config

            # GTK/WebKit (for Tauri)
            gtk3
            webkitgtk_4_1
            librsvg
            libayatana-appindicator

            # Process management
            process-compose

            # Formatting
            nixfmt-rfc-style
          ];

          shellHook = ''
            export PGDATABASE="librestock_inventory"
            export DATABASE_URL="postgresql://$USER@127.0.0.1:5432/librestock_inventory?sslmode=disable"

            echo ""
            echo "LibreStock Inventory Development Environment"
            echo "======================================"
            echo ""
            echo "PostgreSQL:"
            echo "  Database: $PGDATABASE"
            echo ""
            echo "Services:"
            echo "  nix-services    - Start all services (PostgreSQL, NestJS, Web, Docs)"
            echo "  process-compose - Direct process-compose commands"
            echo ""
            echo "Documentation:"
            echo "  mkdocs serve       - Start docs server at http://localhost:8000"
            echo "  mkdocs build       - Build static docs site"
            echo ""
            echo "Tools available:"
            echo "  Node: $(node --version)"
            echo "  pnpm: $(pnpm --version)"
            echo "  Python: $(python --version)"
            echo "  Rust: $(rustc --version)"
            echo ""

            # Create convenience alias for starting services
            alias nix-services='process-compose -f ${processComposeConfig}'
          '';
        };

        # Expose process-compose config as a package for direct use
        packages.process-compose-config = processComposeConfig;
      }
    );
}
