import type { StockMovementReason } from './stock-movement-reason.enum'

export interface CreateStockMovementDto {
  product_id: string
  from_location_id?: string
  to_location_id?: string
  quantity: number
  reason: StockMovementReason
  order_id?: string
  reference_number?: string
  cost_per_unit?: number
  notes?: string
}
