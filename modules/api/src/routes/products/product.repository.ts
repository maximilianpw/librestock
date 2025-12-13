import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.repository.find({
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.repository.findOneBy({ id });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.repository.findOneBy({ sku });
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    return this.repository.find({
      where: { category_id: categoryId },
      order: { name: 'ASC' },
    });
  }

  async findByCategoryIds(categoryIds: string[]): Promise<Product[]> {
    return this.repository.find({
      where: { category_id: In(categoryIds) },
      order: { name: 'ASC' },
    });
  }

  async create(createData: Partial<Product>): Promise<Product> {
    const product = this.repository.create(createData);
    return this.repository.save(product);
  }

  async update(
    id: string,
    updateData: Partial<Product>,
  ): Promise<Product | null> {
    const product = await this.repository.findOneBy({ id });
    if (product) {
      Object.assign(product, updateData);
      return this.repository.save(product);
    }
    return null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
