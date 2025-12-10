"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClerkClaims = void 0;
const common_1 = require("@nestjs/common");
exports.ClerkClaims = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.auth?.sessionClaims;
});
//# sourceMappingURL=clerk-claims.decorator.js.map