import type { SortOrder } from '../common/sort-order.enum.ts'
import type { LocationSortField } from './location-sort-field.enum.ts'
import type { LocationType } from './location-type.enum.ts'

export interface LocationQueryDto {
  page?: number
  limit?: number
  search?: string
  type?: LocationType
  is_active?: boolean
  sort_by?: LocationSortField
  sort_order?: SortOrder
}
