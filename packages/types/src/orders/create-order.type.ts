export interface CreateOrderItemType {
  product_id: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}

export interface CreateOrderType {
  client_id: string;
  delivery_address: string;
  delivery_deadline?: string;
  yacht_name?: string;
  special_instructions?: string;
  items: CreateOrderItemType[];
}
