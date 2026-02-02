import type { PaginationMeta } from '../common/pagination-meta.type.js'
import type { ProductResponseDto } from './product-response.type.js'

export interface PaginatedProductsResponseDto {
  data: ProductResponseDto[]
  meta: PaginationMeta
}
