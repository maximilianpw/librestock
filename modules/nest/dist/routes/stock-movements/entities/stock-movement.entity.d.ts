import { StockMovementReason } from '../../../common/enums';
import { Location } from '../../locations/entities/location.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class StockMovement {
    id: string;
    product_id: string;
    from_location_id: string | null;
    fromLocation: Location | null;
    to_location_id: string | null;
    toLocation: Location | null;
    quantity: number;
    reason: StockMovementReason;
    order_id: string | null;
    order: Order | null;
    reference_number: string | null;
    cost_per_unit: number | null;
    kanban_task_id: string | null;
    user_id: string;
    notes: string | null;
    created_at: Date;
}
