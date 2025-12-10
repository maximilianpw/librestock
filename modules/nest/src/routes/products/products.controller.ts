import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard';
import { ErrorResponseDto } from '../../common/dto/error-response.dto';
import { MessageResponseDto } from '../../common/dto/message-response.dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new product in the inventory system',
    operationId: 'createProduct',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - SKU already exists',
    type: ErrorResponseDto,
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieves all products from the inventory system. Can filter by category or get low stock items.',
    operationId: 'getAllProducts',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter products by category',
    example: 'Food & Beverages',
  })
  @ApiQuery({
    name: 'low_stock',
    required: false,
    description: 'Get only products with low stock (below minimum stock level)',
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [Product],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async findAll(
    @Query('category') category?: string,
    @Query('low_stock') lowStock?: string,
  ): Promise<Product[]> {
    if (lowStock === 'true') {
      return await this.productsService.findLowStock();
    }

    if (category) {
      return await this.productsService.findByCategory(category);
    }

    return await this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a product by ID',
    description: 'Retrieves a single product by its unique identifier',
    operationId: 'getProductById',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: Product,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(id);
  }

  @Get('sku/:sku')
  @ApiOperation({
    summary: 'Get a product by SKU',
    description: 'Retrieves a single product by its SKU (Stock Keeping Unit)',
    operationId: 'getProductBySku',
  })
  @ApiParam({
    name: 'sku',
    description: 'Product SKU',
    example: 'OIL-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: Product,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  async findBySku(@Param('sku') sku: string): Promise<Product> {
    return await this.productsService.findBySku(sku);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a product',
    description: 'Updates an existing product by its ID',
    operationId: 'updateProduct',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - SKU already exists',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Deletes a product from the inventory system',
    operationId: 'deleteProduct',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<MessageResponseDto> {
    await this.productsService.remove(id);
    return { message: 'Product deleted successfully' };
  }
}
