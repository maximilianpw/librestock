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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async create(createProductDto) {
        const existingProduct = await this.productsRepository.findOne({
            where: { sku: createProductDto.sku },
        });
        if (existingProduct) {
            throw new common_1.ConflictException(`Product with SKU "${createProductDto.sku}" already exists`);
        }
        const product = this.productsRepository.create(createProductDto);
        return await this.productsRepository.save(product);
    }
    async findAll() {
        return await this.productsRepository.find({
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            const existingProduct = await this.productsRepository.findOne({
                where: { sku: updateProductDto.sku },
            });
            if (existingProduct) {
                throw new common_1.ConflictException(`Product with SKU "${updateProductDto.sku}" already exists`);
            }
        }
        Object.assign(product, updateProductDto);
        return await this.productsRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepository.remove(product);
    }
    async findBySku(sku) {
        const product = await this.productsRepository.findOne({
            where: { sku },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with SKU "${sku}" not found`);
        }
        return product;
    }
    async findByCategory(category) {
        return await this.productsRepository.find({
            where: { category },
            order: { name: 'ASC' },
        });
    }
    async findLowStock() {
        const products = await this.productsRepository
            .createQueryBuilder('product')
            .where('product.min_stock_level IS NOT NULL')
            .andWhere('product.stock_quantity <= product.min_stock_level')
            .orderBy('product.stock_quantity', 'ASC')
            .getMany();
        return products;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map