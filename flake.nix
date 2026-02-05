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

        pythonEnv = pkgs.python312.withPackages (ps:
          with ps; [
            mkdocs-material
            mkdocs-git-revision-date-localized-plugin
            pymdown-extensions
          ]);

        rustToolchain = pkgs.rust-bin.stable.latest.default;
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
            docker-buildx
            docker-compose
            pkg-config
          ] ++ pkgs.lib.optionals pkgs.stdenv.isLinux [
            # GTK/WebKit (for Tauri) - Linux only
            gtk3
            webkitgtk_4_1
            librsvg
            libayatana-appindicator
          ];
        };
      }
    );
}
