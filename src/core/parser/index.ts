import {IToken} from "../../types/IToken";
import {EOF} from "../tokenizer";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {parseRouter} from "./parse.router";
import {parseStatement} from "./parse.statement";
import {IObjectLiteralNode, TFluxASTNode} from "../../types/TFluxAST";
import {parseEmit} from "./parse.emit";
import {parseExport} from "./parse.export";
import {parseImport} from "./parse.import";
import {parseFunction} from "./parse.function";
import {PRECEDENCE} from "../../constants/PRECEDENCE";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {parseTemplate} from "./parse.template";

export class Parser {
    private readonly tokens: IToken[];
    public tokenIndex: number;
    private readonly AST: TFluxASTNode[]; // Absolute syntax tree
    constructor(tokens: IToken[]) {
        this.tokens = tokens;
        this.tokenIndex = 0;
        this.AST = [];
    }

    get currentToken(): IToken {
        return this.tokens[this.tokenIndex] || EOF;
    }

    eat(expectedType: string): IToken {
        const token = this.currentToken;
        if (token.type === expectedType){
            this.tokenIndex++;
            return token;
        }
        FluxErrorHandler.syntax(`Expected ${expectedType}, got ${token.type}(${token.value})`, token.meta)
    }

    parse(){
        const handlers: Record<string, () => TFluxASTNode> = {
            [TOKEN_TYPES.ROUTER]: () => parseRouter(this),
            [TOKEN_TYPES.EMIT]: () => parseEmit(this),
            [TOKEN_TYPES.EXPORT]: () => parseExport(this),
            [TOKEN_TYPES.IMPORT]: () => parseImport(this),
            [TOKEN_TYPES.FN]: () => parseFunction(this),
        }

        while (this.currentToken.type !== TOKEN_TYPES.EOF) {
            const treeObj = handlers[this.currentToken.type]
                ? handlers[this.currentToken.type]()
                : parseStatement(this);

            this.AST.push(treeObj)
        }

        return this.AST;
    }

    parseExpression(): TFluxASTNode {
        if (this.currentToken.type === TOKEN_TYPES.EOF) {
            FluxErrorHandler.syntax('Unexpected end of expression', this.currentToken.meta);
        }

        return this.parseBinaryExpression();
    }
    parseBinaryExpression(precedence: number = 0): TFluxASTNode {
        let leftExpression = this.parseMemberAndCallExpression();

        let operationPrecedence = PRECEDENCE[this.currentToken.type];
        while (operationPrecedence !== undefined && operationPrecedence > precedence) {
            const operationPrecedence = PRECEDENCE[this.currentToken.type];

            if (operationPrecedence === undefined || operationPrecedence <= precedence) break;

            const operator = this.eat(this.currentToken.type);
            const rightExpression = this.parseBinaryExpression(operationPrecedence);

            leftExpression = {
                type: AST_TYPES.BINARY_EXPRESSION,
                operator,
                leftExpression,
                rightExpression,
            };
        }

        return leftExpression;
    }

    parseMemberAndCallExpression(): TFluxASTNode {
        let expression = this.parsePrimary();

        while (true) {
            if (this.currentToken.type === TOKEN_TYPES.DOT) {
                this.eat(TOKEN_TYPES.DOT);
                const property = this.eat(TOKEN_TYPES.IDENT);
                expression = {
                    type: AST_TYPES.MEMBER_EXPRESSION,
                    object: expression,
                    property,
                };
            }
            else if (this.currentToken.type === TOKEN_TYPES.LPAREN) {
                this.eat(TOKEN_TYPES.LPAREN);
                const args: TFluxASTNode[] = [];

                if (this.currentToken.type !== TOKEN_TYPES.RPAREN) {
                    do {
                        args.push(this.parseExpression());
                    } while (this.currentToken.type === TOKEN_TYPES.COMMA && this.eat(TOKEN_TYPES.COMMA));
                }

                this.eat(TOKEN_TYPES.RPAREN);
                expression = {
                    type: AST_TYPES.FUNCTION_CALL,
                    expression: expression,
                    arguments: args,
                };
            } else {
                break;
            }
        }

        return expression;
    }


    parsePrimary(): TFluxASTNode {
        const token = this.currentToken;

        if (token.type === TOKEN_TYPES.NULL){
            this.tokenIndex++;
            return {
                type: AST_TYPES.LITERAL,
                value: token
            }
        }

        if (token.type === TOKEN_TYPES.BACKTICK){
            return parseTemplate(this);
        }

        if (['STRING', 'NUMBER', 'BOOLEAN', 'TYPE'].includes(token.type)) {
            this.tokenIndex++;
            return {
                type: AST_TYPES.LITERAL,
                value: token,
            };
        }

        if (token.type === TOKEN_TYPES.IDENT) {
            this.tokenIndex++;
            return {
                type: AST_TYPES.IDENTIFIER,
                value: token,
            };
        }

        if (token.type === TOKEN_TYPES.LBRACE) {
            return this.parseObjectLiteral();
        }

        if (token.type === TOKEN_TYPES.LPAREN) {
            this.eat(TOKEN_TYPES.LPAREN);
            const expr = this.parseExpression();
            this.eat(TOKEN_TYPES.RPAREN);
            return expr;
        }

        FluxErrorHandler.syntax(`Unexpected token in primary expression: ${token.type}`, token.meta);
    }

    parseObjectLiteral():IObjectLiteralNode{
        this.eat(TOKEN_TYPES.LBRACE);
        const properties = [];

        while (this.currentToken.type !== TOKEN_TYPES.RBRACE) {
            const key = this.eat(TOKEN_TYPES.IDENT);
            this.eat(TOKEN_TYPES.COLON);
            const value = this.parseExpression();
            properties.push({ key, value });

            if (this.currentToken.type === TOKEN_TYPES.COMMA) {
                this.eat(TOKEN_TYPES.COMMA);
            } else {
                break;
            }
        }

        this.eat(TOKEN_TYPES.RBRACE);
        return {
            type: AST_TYPES.OBJECT_LITERAL,
            properties
        };
    }
}