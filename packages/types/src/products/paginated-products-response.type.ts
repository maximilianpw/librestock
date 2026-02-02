import type { PaginationMeta } from '../common/pagination-meta.type.ts'
import type { ProductResponseDto } from './product-response.type.ts'

export interface PaginatedProductsResponseDto {
  data: ProductResponseDto[]
  meta: PaginationMeta
}
