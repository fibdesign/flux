"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const tokenizer_1 = require("../tokenizer");
const FluxErrorHandler_1 = require("../../utils/FluxErrorHandler");
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const parse_router_1 = require("./parse.router");
const parse_statement_1 = require("./parse.statement");
const parse_emit_1 = require("./parse.emit");
const parse_export_1 = require("./parse.export");
const parse_import_1 = require("./parse.import");
const parse_function_1 = require("./parse.function");
const PRECEDENCE_1 = require("../../constants/PRECEDENCE");
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const parse_template_1 = require("./parse.template");
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.tokenIndex = 0;
        this.AST = [];
    }
    get currentToken() {
        return this.tokens[this.tokenIndex] || tokenizer_1.EOF;
    }
    eat(expectedType) {
        const token = this.currentToken;
        if (token.type === expectedType) {
            this.tokenIndex++;
            return token;
        }
        FluxErrorHandler_1.FluxErrorHandler.syntax(`Expected ${expectedType}, got ${token.type}(${token.value})`, token.meta);
    }
    parse() {
        const handlers = {
            [TOKEN_TYPES_1.TOKEN_TYPES.ROUTER]: () => (0, parse_router_1.parseRouter)(this),
            [TOKEN_TYPES_1.TOKEN_TYPES.EMIT]: () => (0, parse_emit_1.parseEmit)(this),
            [TOKEN_TYPES_1.TOKEN_TYPES.EXPORT]: () => (0, parse_export_1.parseExport)(this),
            [TOKEN_TYPES_1.TOKEN_TYPES.IMPORT]: () => (0, parse_import_1.parseImport)(this),
            [TOKEN_TYPES_1.TOKEN_TYPES.FN]: () => (0, parse_function_1.parseFunction)(this),
        };
        while (this.currentToken.type !== TOKEN_TYPES_1.TOKEN_TYPES.EOF) {
            const treeObj = handlers[this.currentToken.type]
                ? handlers[this.currentToken.type]()
                : (0, parse_statement_1.parseStatement)(this);
            this.AST.push(treeObj);
        }
        return this.AST;
    }
    parseExpression() {
        if (this.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.EOF) {
            FluxErrorHandler_1.FluxErrorHandler.syntax('Unexpected end of expression', this.currentToken.meta);
        }
        return this.parseBinaryExpression();
    }
    parseBinaryExpression(precedence = 0) {
        let leftExpression = this.parseMemberAndCallExpression();
        let operationPrecedence = PRECEDENCE_1.PRECEDENCE[this.currentToken.type];
        while (operationPrecedence !== undefined && operationPrecedence > precedence) {
            const operationPrecedence = PRECEDENCE_1.PRECEDENCE[this.currentToken.type];
            if (operationPrecedence === undefined || operationPrecedence <= precedence)
                break;
            const operator = this.eat(this.currentToken.type);
            const rightExpression = this.parseBinaryExpression(operationPrecedence);
            leftExpression = {
                type: AST_TYPES_1.AST_TYPES.BINARY_EXPRESSION,
                operator,
                leftExpression,
                rightExpression,
            };
        }
        return leftExpression;
    }
    parseMemberAndCallExpression() {
        let expression = this.parsePrimary();
        while (true) {
            if (this.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.DOT) {
                this.eat(TOKEN_TYPES_1.TOKEN_TYPES.DOT);
                const property = this.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT);
                expression = {
                    type: AST_TYPES_1.AST_TYPES.MEMBER_EXPRESSION,
                    object: expression,
                    property,
                };
            }
            else if (this.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.LPAREN) {
                this.eat(TOKEN_TYPES_1.TOKEN_TYPES.LPAREN);
                const args = [];
                if (this.currentToken.type !== TOKEN_TYPES_1.TOKEN_TYPES.RPAREN) {
                    do {
                        args.push(this.parseExpression());
                    } while (this.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.COMMA && this.eat(TOKEN_TYPES_1.TOKEN_TYPES.COMMA));
                }
                this.eat(TOKEN_TYPES_1.TOKEN_TYPES.RPAREN);
                expression = {
                    type: AST_TYPES_1.AST_TYPES.FUNCTION_CALL,
                    expression: expression,
                    arguments: args,
                };
            }
            else {
                break;
            }
        }
        return expression;
    }
    parsePrimary() {
        const token = this.currentToken;
        if (token.type === TOKEN_TYPES_1.TOKEN_TYPES.NULL) {
            this.tokenIndex++;
            return {
                type: AST_TYPES_1.AST_TYPES.LITERAL,
                value: token
            };
        }
        if (token.type === TOKEN_TYPES_1.TOKEN_TYPES.BACKTICK) {
            return (0, parse_template_1.parseTemplate)(this);
        }
        if (['STRING', 'NUMBER', 'BOOLEAN', 'TYPE'].includes(token.type)) {
            this.tokenIndex++;
            return {
                type: AST_TYPES_1.AST_TYPES.LITERAL,
                value: token,
            };
        }
        if (token.type === TOKEN_TYPES_1.TOKEN_TYPES.IDENT) {
            this.tokenIndex++;
            return {
                type: AST_TYPES_1.AST_TYPES.IDENTIFIER,
                value: token,
            };
        }
        if (token.type === TOKEN_TYPES_1.TOKEN_TYPES.LBRACE) {
            return this.parseObjectLiteral();
        }
        if (token.type === TOKEN_TYPES_1.TOKEN_TYPES.LPAREN) {
            this.eat(TOKEN_TYPES_1.TOKEN_TYPES.LPAREN);
            const expr = this.parseExpression();
            this.eat(TOKEN_TYPES_1.TOKEN_TYPES.RPAREN);
            return expr;
        }
        FluxErrorHandler_1.FluxErrorHandler.syntax(`Unexpected token in primary expression: ${token.type}`, token.meta);
    }
    parseObjectLiteral() {
        this.eat(TOKEN_TYPES_1.TOKEN_TYPES.LBRACE);
        const properties = [];
        while (this.currentToken.type !== TOKEN_TYPES_1.TOKEN_TYPES.RBRACE) {
            const key = this.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT);
            this.eat(TOKEN_TYPES_1.TOKEN_TYPES.COLON);
            const value = this.parseExpression();
            properties.push({ key, value });
            if (this.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.COMMA) {
                this.eat(TOKEN_TYPES_1.TOKEN_TYPES.COMMA);
            }
            else {
                break;
            }
        }
        this.eat(TOKEN_TYPES_1.TOKEN_TYPES.RBRACE);
        return {
            type: AST_TYPES_1.AST_TYPES.OBJECT_LITERAL,
            properties
        };
    }
}
exports.Parser = Parser;
//# sourceMappingURL=index.js.map