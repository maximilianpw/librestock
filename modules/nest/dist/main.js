"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const client_entity_1 = require("./routes/clients/entities/client.entity");
const audit_log_entity_1 = require("./routes/audit-logs/entities/audit-log.entity");
const inventory_entity_1 = require("./routes/inventory/entities/inventory.entity");
const location_entity_1 = require("./routes/locations/entities/location.entity");
const order_item_entity_1 = require("./routes/orders/entities/order-item.entity");
const order_entity_1 = require("./routes/orders/entities/order.entity");
const photo_entity_1 = require("./routes/photos/entities/photo.entity");
const stock_movement_entity_1 = require("./routes/stock-movements/entities/stock-movement.entity");
const supplier_product_entity_1 = require("./routes/suppliers/entities/supplier-product.entity");
const supplier_entity_1 = require("./routes/suppliers/entities/supplier.entity");
const product_entity_1 = require("./routes/products/entities/product.entity");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
    });
    app.setGlobalPrefix('api/v1', {
        exclude: ['health-check'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('RBI Inventory API')
        .setDescription('REST API for RBI Inventory Management System')
        .setVersion('1.0.0')
        .setContact('API Support', '', '')
        .setLicense('MIT', '')
        .addServer('http://localhost:8080', 'Development Server')
        .addServer('https://api.rbi-inventory.com', 'Production Server')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Clerk JWT token',
    }, 'BearerAuth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        extraModels: [
            client_entity_1.Client,
            location_entity_1.Location,
            supplier_entity_1.Supplier,
            supplier_product_entity_1.SupplierProduct,
            audit_log_entity_1.AuditLog,
            inventory_entity_1.Inventory,
            order_entity_1.Order,
            order_item_entity_1.OrderItem,
            photo_entity_1.Photo,
            stock_movement_entity_1.StockMovement,
            product_entity_1.Product,
        ],
    });
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
//# sourceMappingURL=main.js.map