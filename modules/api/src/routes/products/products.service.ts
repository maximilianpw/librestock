import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { CategoryRepository } from '../categories/category.repository';
import { Category } from '../categories/entities/category.entity';
import { ProductResponseDto } from './dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  private categories: Category[] = [];

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async onModuleInit() {
    await this.loadCategories();
  }

  private async loadCategories() {
    this.categories = await this.categoryRepository.findAll();
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findOne(id: string): Promise<Product> {
    return this.getProductOrFail(id);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    await this.checkCategoryExistence(categoryId, 'NotFound');
    return this.productRepository.findByCategoryId(categoryId);
  }

  async findByCategoryTree(categoryId: string): Promise<Product[]> {
    await this.checkCategoryExistence(categoryId, 'NotFound');

    const categoryIds = this.getAllChildCategoryIds(categoryId);
    categoryIds.push(categoryId);

    return this.productRepository.findByCategoryIds(categoryIds);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    await this.checkCategoryExistence(
      createProductDto.category_id,
      'BadRequest',
    );

    const existingSku = await this.productRepository.findBySku(
      createProductDto.sku,
    );

    if (existingSku) {
      throw new BadRequestException('A product with this SKU already exists');
    }

    return this.productRepository.create({
      ...createProductDto,
      description: createProductDto.description ?? null,
      brand_id: createProductDto.brand_id ?? null,
      volume_ml: createProductDto.volume_ml ?? null,
      weight_kg: createProductDto.weight_kg ?? null,
      dimensions_cm: createProductDto.dimensions_cm ?? null,
      standard_cost: createProductDto.standard_cost ?? null,
      standard_price: createProductDto.standard_price ?? null,
      markup_percentage: createProductDto.markup_percentage ?? null,
      primary_supplier_id: createProductDto.primary_supplier_id ?? null,
      supplier_sku: createProductDto.supplier_sku ?? null,
      notes: createProductDto.notes ?? null,
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.getProductOrFail(id);

    if (updateProductDto.category_id) {
      await this.checkCategoryExistence(
        updateProductDto.category_id,
        'BadRequest',
      );
    }

    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.productRepository.findBySku(
        updateProductDto.sku,
      );

      if (existingSku) {
        throw new BadRequestException('A product with this SKU already exists');
      }
    }

    if (Object.keys(updateProductDto).length === 0) {
      return product;
    }

    return this.productRepository.update(id, updateProductDto);
  }

  async delete(id: string): Promise<void> {
    await this.getProductOrFail(id);
    await this.productRepository.delete(id);
  }

  private async getProductOrFail(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private async checkCategoryExistence(
    categoryId: string,
    errorType: 'NotFound' | 'BadRequest',
  ): Promise<void> {
    const exists =
      this.categories.some((c) => c.id === categoryId) ||
      (await this.categoryRepository.existsById(categoryId));

    if (!exists) {
      throw errorType === 'NotFound'
        ? new NotFoundException('Category not found')
        : new BadRequestException('Category not found');
    }
  }

  private getAllChildCategoryIds(parentId: string): string[] {
    const childIds: string[] = [];
    const findChildren = (currentParentId: string) => {
      for (const category of this.categories) {
        if (category.parent_id === currentParentId) {
          childIds.push(category.id);
          findChildren(category.id);
        }
      }
    };
    findChildren(parentId);
    return childIds;
  }
}
