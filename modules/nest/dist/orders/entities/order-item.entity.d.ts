import { Order } from './order.entity';
export declare class OrderItem {
    id: string;
    order_id: string;
    order: Order;
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    notes: string | null;
    quantity_picked: number;
    quantity_packed: number;
    created_at: Date;
    updated_at: Date;
}
