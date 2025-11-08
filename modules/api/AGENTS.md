# Repository Development Notes

This project scaffolds API layers (handlers/service, biz, data/repository) from OpenAPI descriptions. When adding or modifying functionality under
`internal/`, keep the following in mind:

## Layer Responsibilities

- **Service/Handlers layer (`internal/handlers`)** – Hosts transport-level handlers and request/response translation. Handler methods
  should focus on validating inbound payloads, orchestrating calls to the biz layer, and mapping errors into transport-friendly
  responses. Avoid embedding business rules or persistence details here so the HTTP/RPC surface stays thin and repeatable.
- **Biz layer (`internal/biz`)** – Implements domain orchestration. Biz components coordinate multiple repositories,
  enforce business invariants, and express use cases in a storage-agnostic way. Keep side-effects limited to invoking data-layer
  interfaces, and prefer returning typed domain errors that can be interpreted by upper layers.
- **Data/Repository layer (`internal/repository`)** – Owns persistence concerns and third-party integrations. Implement concrete adapters for
  databases, caches, or external services here. Ensure repository functions expose clean contracts (interfaces, DTOs) so they can
  be mocked easily during testing and to keep regeneration safe.

## Interface Definitions

Biz and repository layers should expose interfaces (e.g., `ProductService`, `ProductRepository`) to enable dependency injection and easy mocking during testing. This promotes loose coupling and testability.

## Error Handling

Use typed domain errors that propagate up through layers. For example, return specific errors from biz layer that handlers can interpret and map to appropriate HTTP status codes.

## Validation Placement

- **Input validation** (e.g., required fields, data types) should occur in the service/handlers layer using framework features like Gin's struct tag validation.
- **Business validation** (e.g., uniqueness checks, complex rules like "SKU must be unique") belongs in the biz layer, where domain logic resides.

## Working With Generated Code

- **OpenAPI as the source of truth** – The base structs and interfaces for the handlers, biz, and repository layers are generated
  automatically from the OpenAPI specification. Avoid manual edits to generated files that would be overwritten during
  regeneration.
- **Extending generated layers** – Place custom logic in separate files or clearly marked extension points so AI-assisted code
  completion can build atop the generated foundations without merge conflicts.
- **Consistent layer responsibilities** – Ensure changes respect the layering contract documented above to keep the generated
  code predictable for downstream automation.

## Migration Path

When evolving existing code (e.g., moving business logic from handlers to biz layer), follow this pattern:

1. Create biz service interfaces and implementations
2. Update handlers to inject and use biz services
3. Move business logic incrementally, testing at each step
4. Ensure repositories remain focused on data access

When updating templates or tooling that emits these layers, verify that regeneration from the OpenAPI definition still produces
compilable artifacts before merging.
