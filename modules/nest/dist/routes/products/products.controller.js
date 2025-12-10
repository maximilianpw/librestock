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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const product_entity_1 = require("./entities/product.entity");
const clerk_auth_guard_1 = require("../../common/guards/clerk-auth.guard");
const error_response_dto_1 = require("../../common/dto/error-response.dto");
const message_response_dto_1 = require("../../common/dto/message-response.dto");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async create(createProductDto) {
        return await this.productsService.create(createProductDto);
    }
    async findAll(category, lowStock) {
        if (lowStock === 'true') {
            return await this.productsService.findLowStock();
        }
        if (category) {
            return await this.productsService.findByCategory(category);
        }
        return await this.productsService.findAll();
    }
    async findOne(id) {
        return await this.productsService.findOne(id);
    }
    async findBySku(sku) {
        return await this.productsService.findBySku(sku);
    }
    async update(id, updateProductDto) {
        return await this.productsService.update(id, updateProductDto);
    }
    async remove(id) {
        await this.productsService.remove(id);
        return { message: 'Product deleted successfully' };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new product',
        description: 'Creates a new product in the inventory system',
        operationId: 'createProduct',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Product created successfully',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - SKU already exists',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all products',
        description: 'Retrieves all products from the inventory system. Can filter by category or get low stock items.',
        operationId: 'getAllProducts',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        description: 'Filter products by category',
        example: 'Food & Beverages',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'low_stock',
        required: false,
        description: 'Get only products with low stock (below minimum stock level)',
        example: 'true',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Products retrieved successfully',
        type: [product_entity_1.Product],
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('low_stock')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a product by ID',
        description: 'Retrieves a single product by its unique identifier',
        operationId: 'getProductById',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product retrieved successfully',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Product not found',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('sku/:sku'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a product by SKU',
        description: 'Retrieves a single product by its SKU (Stock Keeping Unit)',
        operationId: 'getProductBySku',
    }),
    (0, swagger_1.ApiParam)({
        name: 'sku',
        description: 'Product SKU',
        example: 'OIL-001',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product retrieved successfully',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Product not found',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('sku')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findBySku", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a product',
        description: 'Updates an existing product by its ID',
        operationId: 'updateProduct',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product updated successfully',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Product not found',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - SKU already exists',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a product',
        description: 'Deletes a product from the inventory system',
        operationId: 'deleteProduct',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product deleted successfully',
        type: message_response_dto_1.MessageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Product not found',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map