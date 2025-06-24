import {AST_TYPES} from "../constants/AST_TYPES";
import {IToken} from "./IToken";
import {TFluxValue} from "./TFluxValue";
import {IncomingHttpHeaders, IncomingMessage, ServerResponse} from "node:http";

export interface IASTNode {
    type: string,
}
export interface IRouteEnv {
    path: string,
    method: string,
    middlewares: IFunctionCallNode[],
    handler: IFunctionCallNode,
    version?: string,
    flag?: string,
}
export interface IRouteNode extends IASTNode {
    type: typeof AST_TYPES.ROUTE,
    method: IToken,
    path: string,
    middlewares: IToken[],
    handler: IToken
}
export interface IRouterNode extends IASTNode {
    type: typeof AST_TYPES.ROUTER,
    path: string,
    middlewares: IToken[],
    routes: IRouteNode[]
}
export interface IEmitNode extends IASTNode {
    type: typeof AST_TYPES.EMIT,
    value: TFluxASTNode,
}
export interface IBinaryExpressionNode extends IASTNode {
    type: typeof AST_TYPES.BINARY_EXPRESSION,
    operator: IToken,
    leftExpression: TFluxASTNode,
    rightExpression: TFluxASTNode,
}
export interface IMemberExpressionNode extends IASTNode {
    type: typeof AST_TYPES.MEMBER_EXPRESSION,
    object: TFluxASTNode ,
    property: IToken
}

export interface IFunctionCallNode extends IASTNode {
    type: typeof AST_TYPES.FUNCTION_CALL,
    expression: TFluxASTNode,
    arguments: TFluxASTNode[]
}

export interface IObjectLiteralNode extends IASTNode {
    type: typeof AST_TYPES.OBJECT_LITERAL,
    properties: {
        key: IToken;
        value: TFluxASTNode;
    }[]
}
export interface IImportNode extends IASTNode {
    type: typeof AST_TYPES.IMPORT,
    path: string,
    name: string,
}
export interface IExportNode extends IASTNode {
    type: typeof AST_TYPES.EXPORT,
    properties: IToken[]
}
export interface IFunctionNode extends IASTNode {
    type: typeof AST_TYPES.FUNCTION,
    name: string,
    params: {name: IToken, type: IToken}[],
    returnType: IToken,
    body: TFluxASTNode[]
}

export interface ILiteralNode extends IASTNode {
    type: typeof AST_TYPES.LITERAL,
    value: IToken,
}
export interface IIdentifierNode extends IASTNode {
    type: typeof AST_TYPES.IDENTIFIER,
    value: IToken,
}
export interface IReturnNode extends IASTNode {
    type: typeof AST_TYPES.RETURN,
    value: TFluxASTNode,
}
export interface ITypeNode extends IASTNode {
    type: typeof AST_TYPES.TYPE,
    value: TFluxASTNode,
    varType: IToken,
    varName: IToken,
    isConstant: boolean,
    nullable: boolean,
}

export interface IAssignmentNode extends IASTNode {
    type: typeof AST_TYPES.ASSIGNMENT,
    expression: TFluxASTNode,
    name: IToken,
}

export interface IExpressionStatementNode extends IASTNode {
    type: typeof AST_TYPES.EXPRESSION_STATEMENT,
    expression: TFluxASTNode,
}
export interface ITemplateNode extends IASTNode {
    type: typeof AST_TYPES.TEMPLATE_LITERAL,
    values: TTemplateValue[]
}
export interface ITemplateStringValue {
    type: 'string',
    value: TFluxValue
}
export interface ITemplateExpressionValue {
    type: 'expression',
    value: TFluxASTNode
}
export type TTemplateValue = ITemplateStringValue | ITemplateExpressionValue

export interface IFuxRequestNode {
    type: 'fluxReq',
    method: string,
    url: string,
    headers: IncomingHttpHeaders,
    queries: Record<string, string>,
    params:  Record<string, any>,
}
export type TFluxASTNode = IRouteNode
    | IRouterNode
    | IEmitNode
    | IBinaryExpressionNode
    | IMemberExpressionNode
    | IFunctionCallNode
    | IObjectLiteralNode
    | IImportNode
    | IExportNode
    | IFunctionNode
    | ILiteralNode
    | IIdentifierNode
    | IReturnNode
    | ITypeNode
    | IAssignmentNode
    | IExpressionStatementNode
    | ITemplateNode
    | IFuxRequestNode;