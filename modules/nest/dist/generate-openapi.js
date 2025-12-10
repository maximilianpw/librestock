"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
async function generateOpenApi() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: false,
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
        .addTag('Health', 'System health endpoints')
        .addTag('Auth', 'Authentication endpoints (Clerk JWT)')
        .addTag('Users', 'User management endpoints')
        .addTag('Categories', 'Product category management')
        .addTag('Products', 'Product catalog management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const outputPath = path.resolve(__dirname, '..', '..', '..', 'openapi.yaml');
    const yamlContent = yaml.dump(document, { noRefs: true });
    fs.writeFileSync(outputPath, yamlContent, 'utf8');
    console.log(`OpenAPI spec generated successfully at: ${outputPath}`);
    await app.close();
    process.exit(0);
}
generateOpenApi().catch((error) => {
    console.error('Failed to generate OpenAPI spec:', error);
    process.exit(1);
});
//# sourceMappingURL=generate-openapi.js.map