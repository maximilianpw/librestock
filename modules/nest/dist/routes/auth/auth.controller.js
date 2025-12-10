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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const backend_1 = require("@clerk/backend");
const profile_response_dto_1 = require("./dto/profile-response.dto");
const session_claims_response_dto_1 = require("./dto/session-claims-response.dto");
const error_response_dto_1 = require("../../common/dto/error-response.dto");
const clerk_auth_guard_1 = require("../../common/guards/clerk-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const clerk_claims_decorator_1 = require("../../common/decorators/clerk-claims.decorator");
let AuthController = class AuthController {
    constructor(configService) {
        this.configService = configService;
    }
    async getProfile(userId) {
        const secretKey = this.configService.get('CLERK_SECRET_KEY');
        const client = (0, backend_1.createClerkClient)({ secretKey });
        const user = await client.users.getUser(userId);
        return user;
    }
    getSessionClaims(claims, user) {
        return {
            user_id: user.userId,
            session_id: user.sessionId,
            expires_at: claims.exp,
            issued_at: claims.iat,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user profile',
        description: 'Retrieves the current user profile from Clerk',
        operationId: 'getProfile',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile retrieved successfully',
        type: profile_response_dto_1.ProfileResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('session-claims'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get session claims',
        description: 'Retrieves the current session JWT claims',
        operationId: 'getSessionClaims',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Session claims retrieved successfully',
        type: session_claims_response_dto_1.SessionClaimsResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, clerk_claims_decorator_1.ClerkClaims)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", session_claims_response_dto_1.SessionClaimsResponseDto)
], AuthController.prototype, "getSessionClaims", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map