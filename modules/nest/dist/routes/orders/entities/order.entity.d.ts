import { OrderStatus } from '../../../common/enums';
import { Client } from 'src/routes/clients/entities/client.entity';
export declare class Order {
    id: string;
    order_number: string;
    client_id: string;
    client: Client;
    status: OrderStatus;
    delivery_deadline: Date | null;
    delivery_address: string;
    yacht_name: string | null;
    special_instructions: string | null;
    total_amount: number;
    assigned_to: string | null;
    created_by: string;
    confirmed_at: Date | null;
    shipped_at: Date | null;
    delivered_at: Date | null;
    kanban_task_id: string | null;
    created_at: Date;
    updated_at: Date;
}
