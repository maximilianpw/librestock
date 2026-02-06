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

Health, Auth, Categories, Products, Locations, Areas, Inventory, AuditLogs, Branding, Users

### Entity-Only Modules (not yet wired up)

Orders, Photos, StockMovements, Suppliers, Clients — these have entity definitions but no controller/service/repository yet.

### User Roles

Roles are stored in the `user_roles` DB table (not in Better Auth sessions). The `RolesGuard` queries this table at runtime. To assign roles, insert into `user_roles` or use the admin API endpoints. The `admin()` Better Auth plugin provides ban/unban/delete/list user capabilities.

## Key Patterns

| Pattern         | Location                   | Purpose                                          |
| --------------- | -------------------------- | ------------------------------------------------ |
| Repository      | `api/src/routes/*/`        | Data access layer                                |
| Service         | `api/src/routes/*/`        | Business logic (only Services are exported from modules) |
| BaseAuditEntity | `api/src/common/entities/` | Soft delete + audit fields                       |
| BetterAuthModule | `api/src/app.module.ts`   | Global auth guard via `disableGlobalAuthGuard: false` |
| RolesGuard      | `api/src/common/guards/`   | `@Roles()` decorator for role-based access       |
| HATEOAS         | `api/src/common/hateoas/`  | REST hypermedia links (includes `/api/v1` prefix) |
| Shared DTOs     | `packages/types/src/`      | Backend/Frontend contracts                       |
| sanitizeUrl     | `web/src/lib/utils.ts`     | Strips dangerous URL protocols (javascript:, data:) |
| toPaginationMeta | `api/src/common/utils/pagination.utils.ts` | Shared pagination metadata builder |
| DB connection   | `api/src/config/db-connection.utils.ts` | Shared DB connection params for TypeORM + Better Auth |

### Architecture Rules

- **Modules only export Services**, never Repositories. Cross-module data access must go through the Service layer.
- **All `:id` params** must use `ParseUUIDPipe` for validation.
- **Admin-only endpoints** must use `@UseGuards(RolesGuard)` + `@Roles(UserRole.ADMIN)`.
- **User-submitted URLs** must be validated on both backend (`@IsUrl()`) and frontend (`sanitizeUrl()`). Never render raw URLs from API data in `href` or `src` attributes.
- **DB_SYNCHRONIZE** is blocked in production regardless of env var.

## Adding a New Entity (Full Stack)

1. **Backend entity** in `api/src/routes/<feature>/entities/`
2. **Backend DTOs** in `api/src/routes/<feature>/dto/`
3. **Backend repository/service/controller/module**
4. **Register module** in `api/src/app.module.ts` and `app.routes.ts`
5. **Shared DTOs/enums** in `packages/types/src/<feature>/` — rebuild with `pnpm --filter @librestock/types build`
6. **Frontend hooks** in `web/src/lib/data/<feature>.ts`
7. **Route tree** — `web/src/routeTree.gen.ts` must be updated (auto-generated on `pnpm dev`, or manually add the route entry)
8. **Sidebar nav** — add route to `web/src/components/common/Header.tsx`

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
