import type { StockMovementReason } from './stock-movement-reason.enum'

export interface StockMovementLocationSummary {
  id: string
  name: string
}

export interface StockMovementProductSummary {
  id: string
  name: string
  sku: string
}

export interface StockMovementResponseDto {
  id: string
  product_id: string
  product: StockMovementProductSummary | null
  from_location_id: string | null
  from_location: StockMovementLocationSummary | null
  to_location_id: string | null
  to_location: StockMovementLocationSummary | null
  quantity: number
  reason: StockMovementReason
  order_id: string | null
  reference_number: string | null
  cost_per_unit: number | null
  user_id: string
  notes: string | null
  created_at: string | Date
}
