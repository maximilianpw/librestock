import type { PaginationMeta } from '../common/pagination-meta.type.ts'
import type { InventoryResponseDto } from './inventory-response.type.ts'

export interface PaginatedInventoryResponseDto {
  data: InventoryResponseDto[]
  meta: PaginationMeta
}
