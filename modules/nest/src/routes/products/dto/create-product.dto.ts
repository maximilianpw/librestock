import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Premium Olive Oil' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Product SKU (Stock Keeping Unit)', example: 'OIL-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  sku: string;

  @ApiPropertyOptional({ description: 'Product description', example: 'Extra virgin olive oil from Italy' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Product category', example: 'Food & Beverages' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  category?: string;

  @ApiProperty({ description: 'Unit price', example: 25.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Cost price', example: 15.50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  cost_price?: number;

  @ApiPropertyOptional({ description: 'Current stock quantity', example: 100, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock_quantity?: number;

  @ApiPropertyOptional({ description: 'Minimum stock level', example: 10 })
  @IsInt()
  @Min(0)
  @IsOptional()
  min_stock_level?: number;

  @ApiPropertyOptional({ description: 'Maximum stock level', example: 500 })
  @IsInt()
  @Min(0)
  @IsOptional()
  max_stock_level?: number;

  @ApiPropertyOptional({ description: 'Unit of measurement', example: 'liter' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  unit_of_measurement?: string;

  @ApiPropertyOptional({ description: 'Product barcode', example: '1234567890123' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  barcode?: string;

  @ApiPropertyOptional({ description: 'Product weight in kg', example: 1.5 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Product dimensions (e.g., LxWxH)', example: '30x10x40 cm' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  dimensions?: string;

  @ApiPropertyOptional({ description: 'Whether product is active', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ description: 'Additional notes', example: 'Store in cool, dry place' })
  @IsString()
  @IsOptional()
  notes?: string;
}
