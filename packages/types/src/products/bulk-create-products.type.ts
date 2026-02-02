import type { CreateProductDto } from './create-product.type.ts'

export interface BulkCreateProductsDto {
  products: CreateProductDto[]
}
