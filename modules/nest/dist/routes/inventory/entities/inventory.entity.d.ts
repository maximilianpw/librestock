import { Location } from '../../locations/entities/location.entity';
export declare class Inventory {
    id: string;
    product_id: string;
    location_id: string;
    location: Location;
    quantity: number;
    batch_number: string | null;
    expiry_date: Date | null;
    cost_per_unit: number | null;
    received_date: Date | null;
    updated_at: Date;
}
