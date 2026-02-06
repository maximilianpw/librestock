import type { StockMovementReason } from './stock-movement-reason.enum'

export interface StockMovementQueryDto {
  page?: number
  limit?: number
  product_id?: string
  location_id?: string
  reason?: StockMovementReason
  date_from?: string
  date_to?: string
}
