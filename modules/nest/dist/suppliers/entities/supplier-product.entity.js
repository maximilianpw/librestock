"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierProduct = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const supplier_entity_1 = require("./supplier.entity");
let SupplierProduct = class SupplierProduct {
};
exports.SupplierProduct = SupplierProduct;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier', format: 'uuid' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SupplierProduct.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supplier ID', format: 'uuid' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "supplier_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supplier relation', type: () => supplier_entity_1.Supplier }),
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], SupplierProduct.prototype, "supplier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID', format: 'uuid' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "product_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supplier SKU', nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], SupplierProduct.prototype, "supplier_sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cost per unit', type: 'number', nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], SupplierProduct.prototype, "cost_per_unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lead time in days', nullable: true }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SupplierProduct.prototype, "lead_time_days", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum order quantity', nullable: true }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], SupplierProduct.prototype, "minimum_order_quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is the preferred supplier',
        default: false,
    }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SupplierProduct.prototype, "is_preferred", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], SupplierProduct.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], SupplierProduct.prototype, "updated_at", void 0);
exports.SupplierProduct = SupplierProduct = __decorate([
    (0, typeorm_1.Entity)('supplier_products')
], SupplierProduct);
//# sourceMappingURL=supplier-product.entity.js.map