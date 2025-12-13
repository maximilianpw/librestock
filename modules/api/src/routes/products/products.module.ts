import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductRepository } from './product.repository';
import { Product } from './entities/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository, ClerkAuthGuard],
  exports: [ProductsService, ProductRepository],
})
export class ProductsModule {}
