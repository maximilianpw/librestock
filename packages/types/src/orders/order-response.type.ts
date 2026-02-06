import { OrderStatus } from './order-status.enum';

export interface OrderItemResponseType {
  id: string;
  product_id: string;
  product_name: string | null;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes: string | null;
  quantity_picked: number;
  quantity_packed: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrderResponseType {
  id: string;
  order_number: string;
  client_id: string;
  client_name: string | null;
  status: OrderStatus;
  delivery_address: string;
  delivery_deadline: Date | null;
  yacht_name: string | null;
  special_instructions: string | null;
  total_amount: number;
  assigned_to: string | null;
  created_by: string;
  confirmed_at: Date | null;
  shipped_at: Date | null;
  delivered_at: Date | null;
  kanban_task_id: string | null;
  items: OrderItemResponseType[];
  created_at: Date;
  updated_at: Date;
}
