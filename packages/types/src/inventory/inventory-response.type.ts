import type { BaseResponseDto } from '../common/base-response.type.js'
import type { AreaSummaryDto } from './area-summary.type.js'
import type { LocationSummaryDto } from './location-summary.type.js'
import type { ProductSummaryDto } from './product-summary.type.js'

export interface InventoryResponseDto extends BaseResponseDto {
  id: string
  product_id: string
  product: ProductSummaryDto | null
  location_id: string
  location: LocationSummaryDto | null
  area_id: string | null
  area: AreaSummaryDto | null
  quantity: number
  batchNumber: string
  expiry_date: string | Date | null
  cost_per_unit: number | null
  received_date: string | Date | null
}
