// parser.js

import { tokenize } from './tokenizer.js';

export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
        this.ast = [];
    }

    current() {
        return this.tokens[this.position] || ['EOF', ''];
    }

    eat(expectedType) {
        const [tokType, tokVal] = this.current();
        if (tokType === expectedType) {
            this.position++;
            return tokVal;
        }
        throw new SyntaxError(`Expected ${expectedType}, got ${tokType}(${tokVal})`);
    }

    parse() {
        while (this.current()[0] !== 'EOF') {
            if (this.current()[0] === 'ROUTER') {
                this.ast.push(this.parseRouter());
            }else if (this.current()[0] === 'FN') {
                this.ast.push(this.parseFunction());
            } else if (this.current()[0] === 'EMIT') {
                this.ast.push(this.parseEmit());
            } else {
                this.ast.push(this.parseStatement());
            }
        }
        return this.ast;
    }

    parseRouter() {
        this.eat('ROUTER');
        const basePath = this.eat('STRING');

        let baseMiddlewares = [];
        // Check if arrow is present (optional middleware array)
        if (this.current()[0] === 'ARROW') {
            this.eat('ARROW');

            // Check if bracket follows (middlewares present)
            if (this.current()[0] === 'LBRACKET') {
                this.eat('LBRACKET');
                while (this.current()[0] !== 'RBRACKET') {
                    baseMiddlewares.push(this.eat('IDENT'));
                    if (this.current()[0] === 'COMMA') this.eat('COMMA');
                    else break;
                }
                this.eat('RBRACKET');
            }
            // Else: => without [] means no middlewares
        }

        this.eat('LBRACE');
        const routes = [];

        while (this.current()[0] !== 'RBRACE') {
            if (this.current()[0] === 'ROUTER') {
                routes.push(this.parseRouter());
            } else {
                const method = this.eat('METHOD');
                const path = this.eat('STRING');
                this.eat('ARROW');

                let routeMiddlewares = [];
                // Optional middleware array for routes
                if (this.current()[0] === 'LBRACKET') {
                    this.eat('LBRACKET');
                    while (this.current()[0] !== 'RBRACKET') {
                        routeMiddlewares.push(this.eat('IDENT'));
                        if (this.current()[0] === 'COMMA') this.eat('COMMA');
                        else break;
                    }
                    this.eat('RBRACKET');
                }

                const handler = this.eat('IDENT');
                if (this.current()[0] === 'COMMA') this.eat('COMMA');

                routes.push({
                    kind: 'route',
                    method,
                    path: path.slice(1, -1),
                    middlewares: routeMiddlewares,
                    handler
                });
            }
        }

        this.eat('RBRACE');

        return {
            kind: 'router',
            basePath: basePath.slice(1, -1),
            baseMiddlewares,
            routes
        };
    }

    parseFunction() {
        this.eat('FN');
        const name = this.eat('IDENT');

        this.eat('LPAREN');
        const params = [];
        while (this.current()[0] !== 'RPAREN') {
            const paramName = this.eat('IDENT');
            this.eat('COLON');
            const paramType = this.eat('TYPE');
            params.push({ name: paramName, type: paramType });

            if (this.current()[0] === 'COMMA') {
                this.eat('COMMA');
            } else {
                break;
            }
        }
        this.eat('RPAREN');

        this.eat('ARROW');
        const returnType = this.eat('TYPE');

        this.eat('LBRACE');
        const body = [];
        while (this.current()[0] !== 'RBRACE') {
            if (this.current()[0] === 'RETURN') {
                body.push(this.parseReturn());
            } else if (this.current()[0] === 'EMIT') {
                body.push(this.parseEmit());
            } else {
                body.push(this.parseStatement());
            }
        }
        this.eat('RBRACE');

        return {
            kind: 'function',
            name,
            params,
            returnType,
            body
        };
    }

    parseReturn() {
        this.eat('RETURN');
        const value = this.parseExpression();
        this.eat('SEMICOLON');
        return {
            kind: 'return',
            value
        };
    }

    parseEmit() {
        this.eat('EMIT');
        const value = this.parseExpression();
        this.eat('SEMICOLON');
        return {
            kind: 'emit',
            value
        };
    }

    parseStatement() {
        if (this.current()[0] === 'RETURN') {
            return this.parseReturn();
        } else if (this.current()[0] === 'EMIT') {
            return this.parseEmit();
        } else if (this.current()[0] === 'TYPE') {
            return this.parseVarDeclaration();
        } else {
            const expr = this.parseExpression();
            this.eat('SEMICOLON');
            return {
                kind: 'expression_statement',
                expression: expr
            };
        }
    }

    parseVarDeclaration() {
        const varType = this.eat('TYPE');
        const varName = this.eat('IDENT');
        this.eat('EQUALS');
        const value = this.parseExpression();
        let isConst = false;
        if (this.current()[0] === 'AS') {
            this.eat('AS');
            this.eat('CONST');
            isConst = true;
        }
        this.eat('SEMICOLON');
        return {
            kind: 'var_declaration',
            type: varType,
            name: varName,
            value,
            const: isConst
        };
    }

    parseExpression() {
        let expr = this.parsePrimary();

        while (['PLUS', 'MINUS', 'STAR', 'SLASH'].includes(this.current()[0])) {
            const op = this.eat(this.current()[0]);
            const right = this.parsePrimary();
            expr = {
                type: 'binary_expression',
                operator: op,
                left: expr,
                right: right
            };
        }

        return expr;
    }

    parsePrimary() {
        const [type, value] = this.current();

        if (['STRING', 'TEMPLATE', 'NUMBER', 'BOOLEAN'].includes(type)) {
            this.position++;
            return [type, value];
        }

        if (type === 'IDENT') {
            const name = this.eat('IDENT');
            if (this.current()[0] === 'LPAREN') {
                this.eat('LPAREN');
                const args = [];
                while (this.current()[0] !== 'RPAREN') {
                    args.push(this.parseExpression());
                    if (this.current()[0] === 'COMMA') {
                        this.eat('COMMA');
                    } else {
                        break;
                    }
                }
                this.eat('RPAREN');
                return {
                    type: 'function_call',
                    name,
                    args
                };
            }
            return ['IDENT', name];
        }

        throw new SyntaxError(`Unexpected expression start: ${type}`);
    }
}
