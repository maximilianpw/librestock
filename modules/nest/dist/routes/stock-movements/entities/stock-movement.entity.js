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
exports.StockMovement = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
const location_entity_1 = require("../../locations/entities/location.entity");
const order_entity_1 = require("../../orders/entities/order.entity");
let StockMovement = class StockMovement {
};
exports.StockMovement = StockMovement;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier', format: 'uuid' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StockMovement.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID', format: 'uuid' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], StockMovement.prototype, "product_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source location ID',
        format: 'uuid',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "from_location_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source location relation',
        type: () => location_entity_1.Location,
        nullable: true,
    }),
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'from_location_id' }),
    __metadata("design:type", location_entity_1.Location)
], StockMovement.prototype, "fromLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destination location ID',
        format: 'uuid',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "to_location_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destination location relation',
        type: () => location_entity_1.Location,
        nullable: true,
    }),
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'to_location_id' }),
    __metadata("design:type", location_entity_1.Location)
], StockMovement.prototype, "toLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity moved' }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for the stock movement',
        enum: enums_1.StockMovementReason,
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.StockMovementReason,
    }),
    __metadata("design:type", String)
], StockMovement.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Related order ID',
        format: 'uuid',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Related order relation',
        type: () => order_entity_1.Order,
        nullable: true,
    }),
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.Order)
], StockMovement.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reference number', nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "reference_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cost per unit', type: 'number', nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], StockMovement.prototype, "cost_per_unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Kanban task ID', nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "kanban_task_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who performed the movement',
        format: 'uuid',
    }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], StockMovement.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', nullable: true }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], StockMovement.prototype, "created_at", void 0);
exports.StockMovement = StockMovement = __decorate([
    (0, typeorm_1.Entity)('stock_movements')
], StockMovement);
//# sourceMappingURL=stock-movement.entity.js.map