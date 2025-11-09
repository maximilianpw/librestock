# RBI Inventory API - Architecture Diagram

## System Architecture Overview

```mermaid
graph TB
    subgraph Clients["🌐 External Clients"]
        WEB["Web Browser"]
        MOBILE["Mobile App"]
        DESKTOP["Desktop App"]
    end

    subgraph HTTPLayer["🌍 Gin Web Framework"]
        CORS["CORS Middleware<br/>Allow: localhost:3000<br/>Methods: GET,POST,PUT,DELETE"]
        LOGGING["Structured Logging Middleware<br/>GinMiddleware"]
        AUTH["Auth Middleware<br/>Clerk JWT Verification"]
    end

    subgraph Routes["📍 API Routes"]
        HEALTH["GET /health-check"]
        AUTH_ROUTE["POST /api/v1/auth/*<br/>Login, Register, Verify"]
        USERS_ROUTE["GET/POST/PUT/DELETE /api/v1/users/*<br/>User Management"]
        CATS_ROUTE["GET/POST/PUT/DELETE /api/v1/categories/*<br/>Category Management"]
        PRODUCTS_ROUTE["GET/POST/PUT/DELETE /api/v1/products/*<br/>Product Management"]
    end

    subgraph Handlers["🎯 HTTP Handler Layer"]
        AUTH_H["AuthHandler<br/>• Login<br/>• Register<br/>• VerifyToken"]
        USERS_H["UsersHandler<br/>• List Users<br/>• Get User<br/>• Create/Update/Delete"]
        CATS_H["CategoriesHandler<br/>• List Categories<br/>• Get Category<br/>• Create/Update/Delete"]
        PRODUCTS_H["ProductsHandler<br/>• List Products<br/>• Get Product<br/>• Create/Update/Delete"]
    end

    subgraph BizLayer["🧠 Business Logic Layer"]
        AUTH_SVC["AuthService<br/>• Login<br/>• Register<br/>• VerifyToken<br/>• RefreshToken"]
        USERS_SVC["UsersService<br/>• List<br/>• GetByID<br/>• Create<br/>• Update<br/>• Delete"]
        CATS_SVC["CategoriesService<br/>• List<br/>• GetByID<br/>• Create<br/>• Update<br/>• Delete"]
        PRODUCTS_SVC["ProductsService<br/>• List Products<br/>• GetByID<br/>• Create<br/>• Update<br/>• Delete<br/>• GetBySKU"]
    end

    subgraph RepositoryLayer["🗄️ Repository Layer"]
        USER_REPO["UserRepository<br/>• FindAll<br/>• FindByID<br/>• FindByEmail<br/>• Create<br/>• Update<br/>• Delete"]
        CATS_REPO["CategoryRepository<br/>• FindAll<br/>• FindByID<br/>• Create<br/>• Update<br/>• Delete<br/>• GetHierarchy"]
        PRODUCTS_REPO["ProductRepository<br/>• FindAll<br/>• FindByID<br/>• FindBySKU<br/>• Create<br/>• Update<br/>• Delete"]
    end

    subgraph Database["💾 PostgreSQL Database"]
        USERS_TABLE["users<br/>System users & auth"]
        CLIENTS_TABLE["clients<br/>Customer data"]
        CATS_TABLE["categories<br/>Product categories"]
        BRANDS_TABLE["brands<br/>Product brands"]
        SUPPLIERS_TABLE["suppliers<br/>Supplier info"]
        PRODUCTS_TABLE["product_catalog<br/>Products"]
        PHOTOS_TABLE["photos<br/>Product photos"]
        SUPPLIER_PRODUCTS["supplier_products<br/>S-P relationships"]
        LOCATIONS_TABLE["locations<br/>Warehouses"]
        INVENTORY_TABLE["inventory<br/>Stock levels"]
        ORDERS_TABLE["orders<br/>Customer orders"]
        ORDER_ITEMS["order_items<br/>Order lines"]
        MOVEMENTS_TABLE["stock_movements<br/>Movement history"]
        AUDIT_TABLE["audit_logs<br/>Change audit trail"]
    end

    subgraph Config["⚙️ Configuration"]
        ENV["Environment Variables<br/>• DATABASE_URL<br/>• PORT (8080)<br/>• CLERK_SECRET_KEY<br/>• LOG_LEVEL"]
    end

    %% Client to HTTP Layer
    Clients -->|HTTP/REST| HTTPLayer

    %% HTTP Layer flow
    HTTPLayer --> CORS
    HTTPLayer --> LOGGING
    HTTPLayer --> AUTH

    %% HTTP Layer to Routes
    CORS --> HEALTH
    AUTH --> AUTH_ROUTE
    AUTH --> USERS_ROUTE
    AUTH --> CATS_ROUTE
    AUTH --> PRODUCTS_ROUTE

    %% Routes to Handlers
    AUTH_ROUTE --> AUTH_H
    USERS_ROUTE --> USERS_H
    CATS_ROUTE --> CATS_H
    PRODUCTS_ROUTE --> PRODUCTS_H

    %% Handlers to Services
    AUTH_H --> AUTH_SVC
    USERS_H --> USERS_SVC
    CATS_H --> CATS_SVC
    PRODUCTS_H --> PRODUCTS_SVC

    %% Services to Repositories
    AUTH_SVC --> USER_REPO
    USERS_SVC --> USER_REPO
    CATS_SVC --> CATS_REPO
    PRODUCTS_SVC --> PRODUCTS_REPO
    PRODUCTS_SVC --> CATS_REPO

    %% Repositories to Database
    USER_REPO --> USERS_TABLE
    USER_REPO --> CLIENTS_TABLE
    CATS_REPO --> CATS_TABLE
    PRODUCTS_REPO --> PRODUCTS_TABLE
    PRODUCTS_REPO --> SUPPLIERS_TABLE
    PRODUCTS_REPO --> BRANDS_TABLE
    PRODUCTS_REPO --> SUPPLIER_PRODUCTS
    PRODUCTS_REPO --> PHOTOS_TABLE

    %% Config to all layers
    Config -.->|Injected| HTTPLayer
    Config -.->|Injected| Handlers
    Config -.->|Injected| BizLayer
    Config -.->|Injected| RepositoryLayer

    style Clients fill:#e1f5ff
    style HTTPLayer fill:#fff3e0
    style Routes fill:#fff9c4
    style Handlers fill:#f3e5f5
    style BizLayer fill:#e8f5e9
    style RepositoryLayer fill:#fce4ec
    style Database fill:#eceff1
    style Config fill:#f1f8e9
```

## Layer Responsibilities

```mermaid
graph LR
    subgraph HL["🎯 Handler Layer"]
        H1["✓ HTTP Request Validation<br/>✓ DTO Mapping<br/>✓ Response Formatting<br/>✓ Status Code Selection<br/>✓ Error Translation"]
    end

    subgraph BL["🧠 Business Layer"]
        B1["✓ Domain Logic<br/>✓ Business Rules<br/>✓ Data Orchestration<br/>✓ Cross-repo Operations<br/>✓ Domain Errors"]
    end

    subgraph RL["🗄️ Repository Layer"]
        R1["✓ Data Persistence<br/>✓ Query Execution<br/>✓ ORM Abstraction<br/>✓ Transaction Mgmt<br/>✓ Query Optimization"]
    end

    HL -->|Validates & Maps| BL
    BL -->|Uses Interfaces| RL
    RL -->|Returns Data| BL
    BL -->|Returns Domain Objects| HL

    style HL fill:#f3e5f5
    style BL fill:#e8f5e9
    style RL fill:#fce4ec
```

## Data Flow Example: Create Product

```mermaid
sequenceDiagram
    actor Client
    participant Handler as ProductHandler
    participant Service as ProductsService
    participant CatRepo as CategoryRepository
    participant ProdRepo as ProductRepository
    participant DB as PostgreSQL

    Client->>Handler: POST /api/v1/products<br/>{ name, sku, categoryId, ... }

    activate Handler
    Handler->>Handler: Validate ProductReq<br/>(struct tags, required fields)

    Handler->>Service: Create(ctx, product)
    deactivate Handler

    activate Service
    Service->>Service: Validate Business Rules

    Service->>CatRepo: GetByID(categoryId)
    activate CatRepo
    CatRepo->>DB: SELECT * FROM categories WHERE id = ?
    DB-->>CatRepo: Category
    CatRepo-->>Service: Category (or error)
    deactivate CatRepo

    alt Category Not Found
        Service-->>Handler: DomainError
    end

    Service->>ProdRepo: Create(ctx, product)
    activate ProdRepo
    ProdRepo->>DB: INSERT INTO product_catalog (...)
    DB-->>ProdRepo: Product with ID
    ProdRepo-->>Service: Product
    deactivate ProdRepo
    deactivate Service

    activate Handler
    Handler->>Handler: Map to ProductResp DTO
    Handler-->>Client: HTTP 201<br/>{ id, name, sku, categoryId, ... }
    deactivate Handler
```

## Dependency Injection Flow

```mermaid
graph TD
    A["main.go"] -->|Load| B["config.Load<br/>DATABASE_URL<br/>PORT<br/>CLERK_SECRET_KEY<br/>LOG_LEVEL"]

    A -->|Initialize| C["database.New<br/>PostgreSQL Connection"]

    A -->|Create| D["gin.Engine"]

    A -->|Build Routes| E["http.BuildRouter<br/>db, config"]

    E -->|Setup Auth Handler| F["auth.BuildRoutes<br/>AuthHandler"]
    F -->|Inject| G["AuthService"]
    G -->|Inject| H["UserRepository"]
    H -->|Use| C

    E -->|Setup Users Handler| I["users.BuildRoutes<br/>UsersHandler"]
    I -->|Inject| J["UsersService"]
    J -->|Inject| K["UserRepository"]
    K -->|Use| C

    E -->|Setup Categories Handler| L["categories.BuildRoutes<br/>CategoriesHandler"]
    L -->|Inject| M["CategoriesService"]
    M -->|Inject| N["CategoryRepository"]
    N -->|Use| C

    E -->|Setup Products Handler| O["products.BuildRoutes<br/>ProductsHandler"]
    O -->|Inject| P["ProductsService"]
    P -->|Inject| Q["ProductRepository<br/>CategoryRepository"]
    Q -->|Use| C

    A -->|Start| R["r.Run:8080"]

    style A fill:#fff3e0
    style B fill:#f1f8e9
    style C fill:#eceff1
    style D fill:#fff9c4
    style E fill:#e1f5ff
    style F fill:#f3e5f5
    style G fill:#e8f5e9
    style H fill:#fce4ec
```

## Architecture Layers Detail

```mermaid
graph TB
    subgraph T1["Transport Layer - HTTP"]
        T["Gin Framework"]
    end

    subgraph T2["Middleware Stack"]
        CORS_MW["CORS"]
        LOG_MW["Structured Logging"]
        AUTH_MW["JWT Authentication"]
    end

    subgraph T3["Handler Layer"]
        direction LR
        H1["Auth Handler"]
        H2["Users Handler"]
        H3["Categories Handler"]
        H4["Products Handler"]
    end

    subgraph T4["DTOs & Validation"]
        D1["Request DTOs"]
        D2["Response DTOs"]
    end

    subgraph T5["Business Logic Layer"]
        direction LR
        S1["Auth Service"]
        S2["Users Service"]
        S3["Categories Service"]
        S4["Products Service"]
    end

    subgraph T6["Domain Models"]
        M1["Domain Errors"]
        M2["Business Rules"]
    end

    subgraph T7["Data Access Layer"]
        direction LR
        R1["User Repository"]
        R2["Category Repository"]
        R3["Product Repository"]
    end

    subgraph T8["ORM Layer"]
        ORM["GORM<br/>Object-Relational Mapping"]
    end

    subgraph T9["Persistence"]
        DB["PostgreSQL Database<br/>14+ with 14 tables"]
    end

    T1 --> T2
    T2 --> T3
    T3 --> T4
    T3 --> T5
    T5 --> T6
    T5 --> T7
    T7 --> ORM
    ORM --> T8
    T8 --> DB

    style T1 fill:#fff3e0
    style T2 fill:#ffe0b2
    style T3 fill:#f3e5f5
    style T4 fill:#e1bee7
    style T5 fill:#e8f5e9
    style T6 fill:#c8e6c9
    style T7 fill:#fce4ec
    style T8 fill:#f8bbd0
    style T9 fill:#eceff1
```

## Database Schema Overview

```mermaid
erDiagram
    USERS ||--o{ CLIENTS : "creates"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ AUDIT_LOGS : "generates"

    CLIENTS ||--o{ ORDERS : "places"

    CATEGORIES ||--o{ PRODUCT_CATALOG : "contains"
    CATEGORIES ||--o{ CATEGORIES : "parent-child"

    BRANDS ||--o{ PRODUCT_CATALOG : "brands"

    SUPPLIERS ||--o{ SUPPLIER_PRODUCTS : "provides"

    PRODUCT_CATALOG ||--o{ PHOTOS : "has"
    PRODUCT_CATALOG ||--o{ SUPPLIER_PRODUCTS : "supplied-by"
    PRODUCT_CATALOG ||--o{ INVENTORY : "tracked-in"
    PRODUCT_CATALOG ||--o{ ORDER_ITEMS : "ordered-in"
    PRODUCT_CATALOG ||--o{ STOCK_MOVEMENTS : "moves-in"

    LOCATIONS ||--o{ INVENTORY : "stores"
    LOCATIONS ||--o{ STOCK_MOVEMENTS : "origin"
    LOCATIONS ||--o{ STOCK_MOVEMENTS : "destination"

    ORDERS ||--o{ ORDER_ITEMS : "contains"

    INVENTORY ||--o{ STOCK_MOVEMENTS : "affects"

    USERS {
        int id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string role
        timestamp created_at
        timestamp updated_at
    }

    CLIENTS {
        int id PK
        int user_id FK
        string company_name
        string contact_name
        string email
        string phone
        text address
        string yacht_name
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        int id PK
        int parent_id FK "nullable"
        string name UK
        text description
        int sort_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    BRANDS {
        int id PK
        string name UK
        text description
        string website
        timestamp created_at
        timestamp updated_at
    }

    SUPPLIERS {
        int id PK
        string name UK
        string contact_name
        string contact_email
        string phone
        text address
        string country
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    PRODUCT_CATALOG {
        int id PK
        int category_id FK
        int brand_id FK "nullable"
        string sku UK
        string name
        text description
        decimal price
        string currency
        decimal weight
        string dimensions
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    PHOTOS {
        int id PK
        int product_id FK
        string url
        string alt_text
        int sort_order
        boolean is_primary
        timestamp created_at
    }

    SUPPLIER_PRODUCTS {
        int id PK
        int supplier_id FK
        int product_id FK
        decimal supplier_price
        string supplier_sku
        int lead_time_days
        int minimum_order_qty
        boolean is_preferred
        timestamp created_at
        timestamp updated_at
    }

    LOCATIONS {
        int id PK
        string name UK
        string code UK
        text address
        string city
        string country
        string warehouse_type "enum"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    INVENTORY {
        int id PK
        int product_id FK
        int location_id FK
        int quantity_available
        int quantity_reserved
        int reorder_level
        int reorder_quantity
        timestamp last_counted_at
        timestamp created_at
        timestamp updated_at
    }

    ORDERS {
        int id PK
        int user_id FK
        int client_id FK
        string order_number UK
        date order_date
        date required_date
        string destination_port
        string yacht_name
        string status "enum"
        decimal total_amount
        string currency
        text notes
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity_ordered
        int quantity_fulfilled
        decimal unit_price
        decimal line_total
        string status "enum"
        text notes
        timestamp created_at
        timestamp updated_at
    }

    STOCK_MOVEMENTS {
        int id PK
        int product_id FK
        int from_location_id FK "nullable"
        int to_location_id FK "nullable"
        int order_id FK "nullable"
        string movement_type "enum"
        int quantity
        string reference_number
        text notes
        int created_by FK
        timestamp movement_date
        timestamp created_at
    }

    AUDIT_LOGS {
        int id PK
        string entity_type
        int entity_id
        string action "enum"
        int user_id FK
        jsonb old_values
        jsonb new_values
        string ip_address
        timestamp created_at
    }
```

## Error Handling Flow

```mermaid
graph TD
    subgraph Handler["Handler Layer"]
        H["HTTP Request"]
        HV["Validate Input"]
    end

    subgraph Service["Service Layer"]
        S["Execute Business Logic"]
        SVE["Domain Validation"]
    end

    subgraph Repo["Repository Layer"]
        R["Database Query"]
    end

    subgraph Errors["Error Types"]
        IE["Input Error<br/>400 Bad Request"]
        BE["Business Error<br/>422 Unprocessable"]
        NF["Not Found<br/>404"]
        DB["Database Error<br/>500"]
    end

    subgraph Response["Response"]
        SUCCESS["HTTP 200/201<br/>Success Response"]
        FAIL["HTTP Error Code<br/>Error Details"]
    end

    H -->|Validate| HV
    HV -->|Valid| S
    HV -->|Invalid| IE

    S -->|Check Rules| SVE
    SVE -->|Fail| BE
    SVE -->|Pass| R

    R -->|Not Found| NF
    R -->|Query Error| DB
    R -->|Success| SUCCESS

    IE --> FAIL
    BE --> FAIL
    NF --> FAIL
    DB --> FAIL

    SUCCESS -->|Serialize DTO| Response
    FAIL -->|Translate Error| Response

    style Handler fill:#f3e5f5
    style Service fill:#e8f5e9
    style Repo fill:#fce4ec
    style Errors fill:#ffebee
    style Response fill:#c8e6c9
```

## Technology Stack

```mermaid
graph LR
    subgraph Language["Language & Runtime"]
        GO["Go 1.24+"]
    end

    subgraph Framework["Web Framework"]
        GIN["Gin Web Framework"]
    end

    subgraph Middleware["Middleware & Security"]
        CORS_LIB["gin-contrib/cors"]
        JWT["Clerk JWT Auth"]
    end

    subgraph Data["Data Access"]
        GORM["GORM ORM"]
        PG["PostgreSQL 14+"]
    end

    subgraph Logging["Logging"]
        SLOG["Structured Logging"]
    end

    subgraph Config["Configuration"]
        ENV["godotenv<br/>.env files"]
    end

    GO --> GIN
    GIN --> CORS_LIB
    GIN --> JWT
    GIN --> GORM
    GORM --> PG
    GO --> SLOG
    GO --> ENV

    style GO fill:#00ADD8
    style GIN fill:#fff3e0
    style CORS_LIB fill:#ffe0b2
    style JWT fill:#ffcc80
    style GORM fill:#c8e6c9
    style PG fill:#eceff1
    style SLOG fill:#e8f5e9
    style ENV fill:#f1f8e9
```

## API Endpoint Structure

```mermaid
graph TD
    API["API: http://localhost:8080"]

    API --> HEALTH["GET /health-check<br/>Health Status"]

    API --> V1["✓ Protected Routes /api/v1<br/>All require JWT Authorization"]

    V1 --> AUTH["Auth Endpoints"]
    AUTH --> LOGIN["POST /auth/login"]
    AUTH --> REGISTER["POST /auth/register"]
    AUTH --> VERIFY["POST /auth/verify"]

    V1 --> USERS["Users Endpoints"]
    USERS --> UL["GET /users"]
    USERS --> UG["GET /users/:id"]
    USERS --> UC["POST /users"]
    USERS --> UU["PUT /users/:id"]
    USERS --> UD["DELETE /users/:id"]

    V1 --> CATS["Categories Endpoints"]
    CATS --> CL["GET /categories"]
    CATS --> CG["GET /categories/:id"]
    CATS --> CC["POST /categories"]
    CATS --> CU["PUT /categories/:id"]
    CATS --> CD["DELETE /categories/:id"]

    V1 --> PRODUCTS["Products Endpoints"]
    PRODUCTS --> PL["GET /products"]
    PRODUCTS --> PG["GET /products/:id"]
    PRODUCTS --> PC["POST /products"]
    PRODUCTS --> PU["PUT /products/:id"]
    PRODUCTS --> PD["DELETE /products/:id"]

    style API fill:#fff3e0
    style HEALTH fill:#fff9c4
    style V1 fill:#f3e5f5
    style AUTH fill:#ffe0b2
    style USERS fill:#c8e6c9
    style CATS fill:#b2dfdb
    style PRODUCTS fill:#bbdefb
```
