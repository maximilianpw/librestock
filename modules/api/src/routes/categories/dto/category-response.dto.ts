import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    description: 'Parent category ID',
    format: 'uuid',
    nullable: true,
  })
  parent_id: string | null;

  @ApiProperty({
    description: 'Category description',
    nullable: true,
    example: 'Electronic equipment and components',
  })
  description: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    format: 'date-time',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    format: 'date-time',
  })
  updated_at: Date;
}
