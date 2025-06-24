"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeRouter = void 0;
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const joinPaths = (base, route) => {
    const cleanBase = (base === '/') ? base : base.endsWith('/') ? base.slice(0, -1) : base;
    if (route === '' || route === '/') {
        return cleanBase === '/' ? '/' : cleanBase;
    }
    const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
    return cleanBase + '/' + cleanRoute;
};
const executeRouter = (interpreter, node) => {
    const basePath = node.path;
    const baseMiddlewares = node.middlewares;
    node.routes.forEach(route => {
        const middlewares = [
            ...baseMiddlewares,
            ...route.middlewares,
        ];
        const finalMiddlewares = middlewares.map((middleware) => ({
            type: AST_TYPES_1.AST_TYPES.FUNCTION_CALL,
            expression: {
                type: AST_TYPES_1.AST_TYPES.IDENTIFIER,
                value: middleware,
            },
            arguments: []
        }));
        const path = joinPaths(basePath, route.path);
        const finalHandler = {
            type: AST_TYPES_1.AST_TYPES.FUNCTION_CALL,
            expression: {
                type: AST_TYPES_1.AST_TYPES.IDENTIFIER,
                value: route.handler,
            },
            arguments: []
        };
        interpreter.Routes.push({
            method: route.method.value,
            path,
            middlewares: finalMiddlewares,
            handler: finalHandler,
        });
    });
};
exports.executeRouter = executeRouter;
//# sourceMappingURL=execute.router.js.map