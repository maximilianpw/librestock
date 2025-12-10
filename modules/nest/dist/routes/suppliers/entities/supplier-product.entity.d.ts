import { Supplier } from './supplier.entity';
export declare class SupplierProduct {
    id: string;
    supplier_id: string;
    supplier: Supplier;
    product_id: string;
    supplier_sku: string | null;
    cost_per_unit: number | null;
    lead_time_days: number | null;
    minimum_order_quantity: number | null;
    is_preferred: boolean;
    created_at: Date;
    updated_at: Date;
}
