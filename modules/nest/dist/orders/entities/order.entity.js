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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../common/enums");
const client_entity_1 = require("../../clients/entities/client.entity");
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier', format: 'uuid' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order number' }),
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Order.prototype, "order_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client ID', format: 'uuid' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Order.prototype, "client_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client relation', type: () => client_entity_1.Client }),
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", client_entity_1.Client)
], Order.prototype, "client", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order status',
        enum: enums_1.OrderStatus,
        default: enums_1.OrderStatus.DRAFT,
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.OrderStatus,
        default: enums_1.OrderStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Delivery deadline', nullable: true }),
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "delivery_deadline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Delivery address' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Order.prototype, "delivery_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Yacht name', nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "yacht_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Special instructions', nullable: true }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "special_instructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total order amount',
        type: 'number',
        default: 0,
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "total_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID assigned to this order',
        format: 'uuid',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "assigned_to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID who created the order', format: 'uuid' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Order.prototype, "created_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when order was confirmed',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "confirmed_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when order was shipped',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "shipped_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when order was delivered',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "delivered_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Kanban task ID', nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "kanban_task_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Order.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Order.prototype, "updated_at", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map