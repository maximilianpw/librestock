export interface CreateInventoryDto {
  product_id: string
  location_id: string
  area_id?: string | null
  quantity: number
  batchNumber?: string
  expiry_date?: string | null
  cost_per_unit?: number | null
  received_date?: string | null
}
