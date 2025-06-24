import {Parser} from "./index";
import {IRouteNode, IRouterNode} from "../../types/TFluxAST";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {IToken} from "../../types/IToken";

export const parseRouter = (parser: Parser): IRouterNode =>{
    parser.eat(TOKEN_TYPES.ROUTER);
    const routerPath = parser.eat(TOKEN_TYPES.STRING)
    parser.eat(TOKEN_TYPES.ARROW)

    const routerMiddlewares: IToken[] = [];
    if (parser.currentToken.type === TOKEN_TYPES.LBRACKET){
        parser.eat(TOKEN_TYPES.LBRACKET);

        while (parser.currentToken.type !== TOKEN_TYPES.RBRACKET){
            routerMiddlewares.push(parser.eat(TOKEN_TYPES.IDENT))
            if (parser.currentToken.type === TOKEN_TYPES.COMMA){
                parser.eat(TOKEN_TYPES.COMMA)
            }else {
                break;
            }
        }

        parser.eat(TOKEN_TYPES.RBRACKET)

    }

    parser.eat(TOKEN_TYPES.LBRACE);
    const routes: IRouteNode[] = [];
    while (parser.currentToken.type !== TOKEN_TYPES.RBRACE){
        const routeMethod = parser.eat(TOKEN_TYPES.METHOD)
        const routePath = parser.eat(TOKEN_TYPES.STRING)
        parser.eat(TOKEN_TYPES.ARROW)

        const routeMiddlewares: IToken[] = [];

        if (parser.currentToken.type === TOKEN_TYPES.LBRACKET){
            parser.eat(TOKEN_TYPES.LBRACKET);

            while (parser.currentToken.type !== TOKEN_TYPES.RBRACKET){
                routeMiddlewares.push(parser.eat(TOKEN_TYPES.IDENT))
                if (parser.currentToken.type === TOKEN_TYPES.COMMA){
                    parser.eat(TOKEN_TYPES.COMMA)
                }else {
                    break;
                }
            }

            parser.eat(TOKEN_TYPES.RBRACKET)

        }

        const handler = parser.eat(TOKEN_TYPES.IDENT)

        routes.push({
            type: AST_TYPES.ROUTE,
            method: routeMethod,
            path: routePath.value.slice(1, -1),
            middlewares: routeMiddlewares,
            handler
        })

        if (parser.currentToken.type === TOKEN_TYPES.COMMA){
            parser.eat(TOKEN_TYPES.COMMA)
        }else {
            break;
        }
    }

    parser.eat(TOKEN_TYPES.RBRACE)

    return {
        type: AST_TYPES.ROUTER,
        path: routerPath.value.slice(1, -1),
        middlewares: routerMiddlewares,
        routes: routes
    }
}