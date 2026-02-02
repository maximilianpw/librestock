import type { SortOrder } from '../common/sort-order.enum.js'
import type { LocationSortField } from './location-sort-field.enum.js'
import type { LocationType } from './location-type.enum.js'

export interface LocationQueryDto {
  page?: number
  limit?: number
  search?: string
  type?: LocationType
  is_active?: boolean
  sort_by?: LocationSortField
  sort_order?: SortOrder
}
