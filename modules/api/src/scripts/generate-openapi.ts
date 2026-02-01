import * as fs from 'node:fs';
import * as path from 'node:path';
import { config } from 'dotenv';

// Load .env before NestFactory initializes modules
config();

// Fix Docker hostname for local execution
if (process.env.DATABASE_URL?.includes('@postgres:')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('@postgres:', '@localhost:');
}

async function generateOpenApi() {
  // Dynamic imports so env vars are loaded first
  const { NestFactory } = await import('@nestjs/core');
  const { ValidationPipe } = await import('@nestjs/common');
  const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
  const yaml = await import('js-yaml');
  const { AppModule } = await import('src/app.module');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
    bodyParser: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const docConfig = new DocumentBuilder()
    .setTitle('LibreStock Inventory API')
    .setDescription('REST API for LibreStock Inventory Management System')
    .setVersion('1.0.0')
    .setContact('API Support', '', '')
    .setLicense('MIT', '')
    .addServer('http://localhost:8080', 'Development Server')
    .addServer('https://api.librestock-inventory.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Better Auth token',
      },
      'BearerAuth',
    )
    .addTag('Health', 'System health endpoints')
    .addTag('Auth', 'Authentication endpoints (Better Auth)')
    .addTag('Users', 'User management endpoints')
    .addTag('Categories', 'Product category management')
    .addTag('Products', 'Product catalog management')
    .addTag('Locations', 'Location management (warehouses, suppliers, etc.)')
    .addTag('Areas', 'Area management (zones, shelves, bins within locations)')
    .addTag('Inventory', 'Inventory management (stock levels by location/area)')
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);

  // Write to root of project (two levels up from this file)
  const outputPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'openapi.yaml',
  );
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
