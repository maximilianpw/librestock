"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const auth_module_1 = require("./routes/auth/auth.module");
const health_module_1 = require("./routes/health/health.module");
const products_module_1 = require("./routes/products/products.module");
exports.routes = [
    {
        path: '',
        module: health_module_1.HealthModule,
    },
    {
        path: 'auth',
        module: auth_module_1.AuthModule,
    },
    {
        path: 'products',
        module: products_module_1.ProductsModule,
    },
];
//# sourceMappingURL=app.routes.js.map