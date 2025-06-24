"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRouter = void 0;
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const parseRouter = (parser) => {
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.ROUTER);
    const routerPath = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.STRING);
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.ARROW);
    const routerMiddlewares = [];
    if (parser.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.LBRACKET) {
        parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.LBRACKET);
        while (parser.currentToken.type !== TOKEN_TYPES_1.TOKEN_TYPES.RBRACKET) {
            routerMiddlewares.push(parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT));
            if (parser.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.COMMA) {
                parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.COMMA);
            }
            else {
                break;
            }
        }
        parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.RBRACKET);
    }
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.LBRACE);
    const routes = [];
    while (parser.currentToken.type !== TOKEN_TYPES_1.TOKEN_TYPES.RBRACE) {
        const routeMethod = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.METHOD);
        const routePath = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.STRING);
        parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.ARROW);
        const routeMiddlewares = [];
        if (parser.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.LBRACKET) {
            parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.LBRACKET);
            while (parser.currentToken.type !== TOKEN_TYPES_1.TOKEN_TYPES.RBRACKET) {
                routeMiddlewares.push(parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT));
                if (parser.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.COMMA) {
                    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.COMMA);
                }
                else {
                    break;
                }
            }
            parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.RBRACKET);
        }
        const handler = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT);
        routes.push({
            type: AST_TYPES_1.AST_TYPES.ROUTE,
            method: routeMethod,
            path: routePath.value.slice(1, -1),
            middlewares: routeMiddlewares,
            handler
        });
        if (parser.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.COMMA) {
            parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.COMMA);
        }
        else {
            break;
        }
    }
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.RBRACE);
    return {
        type: AST_TYPES_1.AST_TYPES.ROUTER,
        path: routerPath.value.slice(1, -1),
        middlewares: routerMiddlewares,
        routes: routes
    };
};
exports.parseRouter = parseRouter;
//# sourceMappingURL=parse.router.js.map