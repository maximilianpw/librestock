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
exports.Photo = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Photo = class Photo {
};
exports.Photo = Photo;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier', format: 'uuid' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Photo.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID', format: 'uuid' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Photo.prototype, "product_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Photo URL' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Photo.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Photo caption', nullable: true }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Photo.prototype, "caption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Display order', default: 0 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Photo.prototype, "display_order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who uploaded the photo',
        format: 'uuid',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Photo.prototype, "uploaded_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Photo.prototype, "created_at", void 0);
exports.Photo = Photo = __decorate([
    (0, typeorm_1.Entity)('photos')
], Photo);
//# sourceMappingURL=photo.entity.js.map