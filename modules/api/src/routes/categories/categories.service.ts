import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryWithChildrenResponseDto } from './dto/category-with-children-response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<CategoryWithChildrenResponseDto[]> {
    const categories = await this.categoryRepository.find({
      order: { name: 'ASC' },
    });

    return this.buildTree(categories);
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    if (createCategoryDto.parent_id) {
      const parentExists = await this.categoryRepository.existsBy({
        id: createCategoryDto.parent_id,
      });
      if (!parentExists) {
        throw new BadRequestException('Parent category not found');
      }
    }

    const category = this.categoryRepository.create({
      name: createCategoryDto.name,
      parent_id: createCategoryDto.parent_id ?? null,
      description: createCategoryDto.description ?? null,
    });

    return this.categoryRepository.save(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (updateCategoryDto.parent_id !== undefined) {
      if (updateCategoryDto.parent_id === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      if (updateCategoryDto.parent_id) {
        const parentExists = await this.categoryRepository.existsBy({
          id: updateCategoryDto.parent_id,
        });
        if (!parentExists) {
          throw new BadRequestException('Parent category not found');
        }

        const wouldCreateCycle = await this.checkForCycle(
          id,
          updateCategoryDto.parent_id,
        );
        if (wouldCreateCycle) {
          throw new BadRequestException(
            'Cannot set parent: would create a circular reference',
          );
        }
      }
    }

    if (updateCategoryDto.name !== undefined) {
      category.name = updateCategoryDto.name;
    }
    if (updateCategoryDto.parent_id !== undefined) {
      category.parent_id = updateCategoryDto.parent_id;
    }
    if (updateCategoryDto.description !== undefined) {
      category.description = updateCategoryDto.description;
    }

    return this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.delete(id);
  }

  private buildTree(categories: Category[]): CategoryWithChildrenResponseDto[] {
    const categoryMap = new Map<string, CategoryWithChildrenResponseDto>();
    const roots: CategoryWithChildrenResponseDto[] = [];

    for (const category of categories) {
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        parent_id: category.parent_id,
        description: category.description,
        created_at: category.created_at,
        updated_at: category.updated_at,
        children: [],
      });
    }

    for (const category of categories) {
      const node = categoryMap.get(category.id)!;

      if (category.parent_id && categoryMap.has(category.parent_id)) {
        const parent = categoryMap.get(category.parent_id)!;
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  private async checkForCycle(
    categoryId: string,
    newParentId: string,
  ): Promise<boolean> {
    let currentId: string | null = newParentId;

    while (currentId) {
      if (currentId === categoryId) {
        return true;
      }

      const parent = await this.categoryRepository.findOne({
        where: { id: currentId },
        select: ['parent_id'],
      });

      currentId = parent?.parent_id ?? null;
    }

    return false;
  }
}
