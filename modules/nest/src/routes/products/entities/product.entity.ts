import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({ description: 'Unique identifier', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Product name' })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ description: 'Product SKU (Stock Keeping Unit)' })
  @Column({ type: 'varchar', unique: true })
  sku: string;

  @ApiProperty({ description: 'Product description', nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Product category', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  category: string | null;

  @ApiProperty({ description: 'Unit price', type: 'number' })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Cost price', type: 'number', nullable: true })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cost_price: number | null;

  @ApiProperty({ description: 'Current stock quantity', default: 0 })
  @Column({ type: 'integer', default: 0 })
  stock_quantity: number;

  @ApiProperty({ description: 'Minimum stock level', nullable: true })
  @Column({ type: 'integer', nullable: true })
  min_stock_level: number | null;

  @ApiProperty({ description: 'Maximum stock level', nullable: true })
  @Column({ type: 'integer', nullable: true })
  max_stock_level: number | null;

  @ApiProperty({ description: 'Unit of measurement (e.g., pcs, kg, liter)', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  unit_of_measurement: string | null;

  @ApiProperty({ description: 'Product barcode', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  barcode: string | null;

  @ApiProperty({ description: 'Product weight in kg', type: 'number', nullable: true })
  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  weight: number | null;

  @ApiProperty({ description: 'Product dimensions (e.g., LxWxH)', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  dimensions: string | null;

  @ApiProperty({ description: 'Whether product is active', default: true })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ApiProperty({ description: 'Additional notes', nullable: true })
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
