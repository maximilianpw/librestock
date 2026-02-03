# LibreStock Inventory System - Agent Context

> Open source pnpm monorepo for self-hostable inventory management. NestJS API + TanStack Start frontend.

## Tech Stack

**Backend:** NestJS 11 · TypeORM · PostgreSQL 16 · Better Auth · Swagger UI
**Frontend:** TanStack Start · React 19 · TanStack Router · TanStack Query/Form · Tailwind · Radix UI · @librestock/types
**Tooling:** pnpm workspaces · Nix flakes · TypeScript

## Monorepo Structure

```
librestock/
├── modules/
│   ├── api/                 # @librestock/api - NestJS backend
│   └── web/                 # @librestock/web - TanStack Start frontend
├── packages/
│   ├── tsconfig/            # Shared TS configs
│   └── eslint-config/       # Shared ESLint config
│   └── types/               # Shared DTO interfaces/enums
├── pnpm-workspace.yaml
└── devenv.nix               # Nix dev environment
```

## Architecture

```
┌─────────────────────────────────────────┐
│           TanStack Start Frontend       │
│  React Query + handwritten clients       │
│  Shared DTOs from @librestock/types      │
│  Better Auth                            │
└─────────────────────────────────────────┘
                    ▼ HTTP/REST
┌─────────────────────────────────────────┐
│            NestJS Backend               │
│  Controller → Service → Repository      │
│  BetterAuthGuard · TypeORM · Swagger UI │
└─────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────┐
│             PostgreSQL                  │
└─────────────────────────────────────────┘
```

## Shared-Types Workflow

```bash
# 1. Define shared types/enums
pnpm --filter @librestock/types build
```

**Keep DTO interfaces/enums in `packages/types` aligned with backend DTOs and frontend usage.**

## Development

```bash
devenv up                    # Start PostgreSQL + API (8080) + Web (3000)

# Or manually:
pnpm --filter @librestock/api start:dev
pnpm --filter @librestock/web dev
```

**Access:**

- API Swagger: http://localhost:8080/api/docs
- Frontend: http://localhost:3000
- Database: localhost:5432

## Common Commands

```bash
pnpm install                 # Install all dependencies
pnpm build                   # Build all packages
pnpm lint                    # Lint all packages
pnpm test                    # Test all packages

# Module-specific
pnpm --filter @librestock/api <cmd>
pnpm --filter @librestock/web <cmd>
```

## Domain Model

```
Product   ← what an item is (SKU, name, category)
Location  ← where items are stored (warehouse, supplier, client)
Area      ← specific spot within a location (zone, shelf, bin)
Inventory ← how many of a product exist at a location/area
```

Products are catalog items. Inventory tracks quantities at locations. Areas provide optional granular placement within locations.

## Key Patterns

| Pattern         | Location                        | Purpose                    |
| --------------- | ------------------------------- | -------------------------- |
| Repository      | `api/src/routes/*/`             | Data access layer          |
| Service         | `api/src/routes/*/`             | Business logic             |
| BaseAuditEntity | `api/src/common/entities/`      | Soft delete + audit fields |
| BetterAuthGuard | `api/src/common/guards/`        | Session verification       |
| HATEOAS         | `api/src/common/hateoas/`       | REST hypermedia links      |
| Shared DTOs     | `packages/types/src/`           | Backend/Frontend contracts |

## Authentication Flow

```
User → Better Auth → Session Cookie
                         ↓
Frontend: Cookie sent automatically
                         ↓
Backend: BetterAuthGuard → verify → session.user
```

## Adding a New Entity (Full Stack)

1. **Backend entity** in `api/src/routes/<feature>/entities/`
2. **Backend DTOs** in `api/src/routes/<feature>/dto/`
3. **Backend repository/service/controller/module**
4. **Register module** in `api/src/app.module.ts` and `app.routes.ts`
5. **Define shared DTOs/enums** in `packages/types/src/<feature>/`
6. **Implement DTOs** in backend to match shared interfaces
7. **Frontend components** using handwritten hooks in `web/src/lib/data/<feature>.ts`

## Environment Variables

**API (`modules/api/.env`):**

```bash
DATABASE_URL=postgresql://...  # or PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
PORT=8080
```

**Web (`modules/web/.env.local`):**

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Module Documentation

See module-specific context files:

- `modules/api/CLAUDE.md` - Backend patterns, entities, endpoints
- `modules/web/CLAUDE.md` - Frontend patterns, components, state management
