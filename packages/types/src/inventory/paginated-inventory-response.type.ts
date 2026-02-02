import type { PaginationMeta } from '../common/pagination-meta.type.js'
import type { InventoryResponseDto } from './inventory-response.type.js'

export interface PaginatedInventoryResponseDto {
  data: InventoryResponseDto[]
  meta: PaginationMeta
}
