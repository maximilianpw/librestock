import type { SortOrder } from '../common/sort-order.enum.ts'
import type { InventorySortField } from './inventory-sort-field.enum.ts'

export interface InventoryQueryDto {
  page?: number
  limit?: number
  product_id?: string
  location_id?: string
  area_id?: string
  search?: string
  low_stock?: boolean
  expiring_soon?: boolean
  min_quantity?: number
  max_quantity?: number
  sort_by?: InventorySortField
  sort_order?: SortOrder
}
