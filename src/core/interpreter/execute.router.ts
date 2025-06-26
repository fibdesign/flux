import {Interpreter} from "./index";
import {IFunctionCallNode, IRouteNode, IRouterNode} from "../../types/TFluxAST";
import {AST_TYPES} from "../../constants/AST_TYPES";

const joinPaths = (base: string, route: string): string => {
    const cleanBase = base.replace(/\/+$/, '');    // remove trailing slashes from base
    const cleanRoute = route.replace(/^\/+/, '')   // remove leading slashes from route
        .replace(/\/+$/, ''); // remove trailing slashes from route

    const joined = cleanBase + (cleanRoute ? '/' + cleanRoute : '');
    return joined || '/';
};

export const executeRouter = (interpreter: Interpreter, node: IRouterNode): void => {
    const basePath = node.path;
    const baseMiddlewares = node.middlewares;


    node.routes.forEach(route => {
        const middlewares = [
            ...baseMiddlewares,
            ...route.middlewares,
        ]
        const finalMiddlewares = middlewares.map((middleware): IFunctionCallNode => ({
            type: AST_TYPES.FUNCTION_CALL,
            expression: {
                type: AST_TYPES.IDENTIFIER,
                value: middleware,
            },
            arguments: []
        }))
        const path = joinPaths(basePath , route.path);
        const finalHandler: IFunctionCallNode = {
            type: AST_TYPES.FUNCTION_CALL,
            expression: {
                type: AST_TYPES.IDENTIFIER,
                value: route.handler,
            },
            arguments: []
        }
        interpreter.Routes.push({
            method: route.method.value,
            path,
            middlewares: finalMiddlewares,
            handler: finalHandler,
        });
    })
}