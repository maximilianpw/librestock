import { verifyToken } from '@clerk/backend';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { Client } from './clients/entities/client.entity';
import { HateoasInterceptor } from './common/hateoas';
import { AuditLog } from './routes/audit-logs/entities/audit-log.entity';
import { Category } from './routes/categories/entities/category.entity';
import { Inventory } from './routes/inventory/entities/inventory.entity';
import { Location } from './routes/locations/entities/location.entity';
import { OrderItem } from './routes/orders/entities/order-item.entity';
import { Order } from './routes/orders/entities/order.entity';
import { Photo } from './routes/photos/entities/photo.entity';
import { StockMovement } from './routes/stock-movements/entities/stock-movement.entity';
import { SupplierProduct } from './routes/suppliers/entities/supplier-product.entity';
import { Supplier } from './routes/suppliers/entities/supplier.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin ?? false,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api/v1', {
    exclude: ['health-check'], // Exclude health check from prefix
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new HateoasInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('LibreStock Inventory API')
    .setDescription('REST API for LibreStock Inventory Management System')
    .setVersion('1.0.0')
    .setContact('API Support', '', '')
    .setLicense('MIT', '')
    .addServer('http://localhost:8080', 'Development Server')
    .addServer('https://api.librestock.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Clerk JWT token',
      },
      'BearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      AuditLog,
      Category,
      Client,
      Inventory,
      Location,
      Order,
      OrderItem,
      Photo,
      StockMovement,
      Supplier,
      SupplierProduct,
    ],
  });
  const swaggerAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;
    const authValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    const [type, token] = authValue?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const secretKey = configService.get<string>('CLERK_SECRET_KEY');
      if (!secretKey) {
        return res.status(500).send('Clerk secret key not configured');
      }
      await verifyToken(token, { secretKey });
      return next();
    } catch {
      return res.status(401).send('Unauthorized');
    }
  };
  app.use(['/api/docs', '/api/docs-json'], swaggerAuthMiddleware);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
