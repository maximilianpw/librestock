export declare class CreateProductDto {
    name: string;
    sku: string;
    description?: string;
    category?: string;
    price: number;
    cost_price?: number;
    stock_quantity?: number;
    min_stock_level?: number;
    max_stock_level?: number;
    unit_of_measurement?: string;
    barcode?: string;
    weight?: number;
    dimensions?: string;
    is_active?: boolean;
    notes?: string;
}
