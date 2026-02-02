import type { CreateProductDto } from './create-product.type.js'

export interface BulkCreateProductsDto {
  products: CreateProductDto[]
}
