export declare class Product {
    id: string;
    name: string;
    sku: string;
    description: string | null;
    category: string | null;
    price: number;
    cost_price: number | null;
    stock_quantity: number;
    min_stock_level: number | null;
    max_stock_level: number | null;
    unit_of_measurement: string | null;
    barcode: string | null;
    weight: number | null;
    dimensions: string | null;
    is_active: boolean;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}
