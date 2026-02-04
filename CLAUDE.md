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
│   ├── eslint-config/       # Shared ESLint config
│   └── types/               # Shared DTO interfaces/enums
├── pnpm-workspace.yaml
└── flake.nix                # Nix dev environment
```

## Development

```bash
devenv up                    # Start PostgreSQL + API (8080) + Web (3000)

# Or manually:
pnpm --filter @librestock/api start:dev
pnpm --filter @librestock/web dev
```

- API Swagger: http://localhost:8080/api/docs
- Frontend: http://localhost:3000
- Database: localhost:5432

## Domain Model

```
Product        ← catalog item (SKU, name, category)
Location       ← where items are stored (warehouse, supplier, client)
Area           ← specific spot within a location (zone, shelf, bin)
Inventory      ← quantity of a product at a location/area
Category       ← product grouping
Order          ← customer order with line items (OrderItem)
StockMovement  ← tracks inventory transfers between locations
Supplier       ← vendor info, with SupplierProduct for per-supplier SKU/pricing
Client         ← customer entity (referenced by Order)
Photo          ← product media
AuditLog       ← system audit trail (action, entity, changes, IP)
Branding       ← singleton app branding settings (name, logo, colors)
```

### Registered Modules (active)

Health, Auth, Categories, Products, Locations, Areas, Inventory, AuditLogs, Branding

### Entity-Only Modules (not yet wired up)

Orders, Photos, StockMovements, Suppliers, Clients — these have entity definitions but no controller/service/repository yet.

## Key Patterns

| Pattern         | Location                   | Purpose                                          |
| --------------- | -------------------------- | ------------------------------------------------ |
| Repository      | `api/src/routes/*/`        | Data access layer                                |
| Service         | `api/src/routes/*/`        | Business logic                                   |
| BaseAuditEntity | `api/src/common/entities/` | Soft delete + audit fields                       |
| BetterAuthModule | `api/src/app.module.ts`   | Global auth guard via `disableGlobalAuthGuard: false` |
| RolesGuard      | `api/src/common/guards/`   | `@Roles()` decorator for role-based access       |
| HATEOAS         | `api/src/common/hateoas/`  | REST hypermedia links                            |
| Shared DTOs     | `packages/types/src/`      | Backend/Frontend contracts                       |

## Adding a New Entity (Full Stack)

1. **Backend entity** in `api/src/routes/<feature>/entities/`
2. **Backend DTOs** in `api/src/routes/<feature>/dto/`
3. **Backend repository/service/controller/module**
4. **Register module** in `api/src/app.module.ts` and `app.routes.ts`
5. **Shared DTOs/enums** in `packages/types/src/<feature>/` — rebuild with `pnpm --filter @librestock/types build`
6. **Frontend hooks** in `web/src/lib/data/<feature>.ts`

## Testing

| Module | Framework | Unit Tests | E2E Tests |
| ------ | --------- | ---------- | --------- |
| API | Jest 30 (`ts-jest`) | `src/routes/*/*.spec.ts` | `test/*.e2e-spec.ts` |
| Web | Playwright | — | `e2e/tests/*.spec.ts` |

```bash
pnpm --filter @librestock/api test                    # API unit tests
pnpm --filter @librestock/api test:e2e                # API e2e tests (needs DB)
pnpm --filter @librestock/web test:e2e                # Playwright (needs devenv up)
```

**Note:** Jest 30 renamed `--testPathPattern` to `--testPathPatterns` (plural). Use:
```bash
pnpm --filter @librestock/api test --testPathPatterns='audit'
```

## Module Documentation

- `modules/api/CLAUDE.md` - Backend patterns, entities, endpoints
- `modules/web/CLAUDE.md` - Frontend patterns, components, state management
