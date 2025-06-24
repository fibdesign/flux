"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFunction = void 0;
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const parse_statement_1 = require("./parse.statement");
const parse_emit_1 = require("./parse.emit");
const parse_return_1 = require("./parse.return");
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const parseFunction = (parser) => {
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.FN);
    const name = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT);
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.LPAREN);
    let params = [];
    while (parser.currentToken.type !== TOKEN_TYPES_1.TOKEN_TYPES.RPAREN) {
        const paramName = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT);
        parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.COLON);
        const paramType = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.TYPE);
        params.push({
            name: paramName,
            type: paramType
        });
        if (parser.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.COMMA) {
            parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.COMMA);
        }
        else {
            break;
        }
    }
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.RPAREN);
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.ARROW);
    const type = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.TYPE);
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.LBRACE);
    let body = [];
    while (parser.currentToken.type !== TOKEN_TYPES_1.TOKEN_TYPES.RBRACE) {
        const handlers = {
            [TOKEN_TYPES_1.TOKEN_TYPES.RETURN]: () => (0, parse_return_1.parseReturn)(parser),
            [TOKEN_TYPES_1.TOKEN_TYPES.EMIT]: () => (0, parse_emit_1.parseEmit)(parser),
        };
        const treeObj = handlers[parser.currentToken.type]
            ? handlers[parser.currentToken.type]()
            : (0, parse_statement_1.parseStatement)(parser);
        body.push(treeObj);
    }
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.RBRACE);
    return {
        type: AST_TYPES_1.AST_TYPES.FUNCTION,
        body,
        returnType: type,
        params,
        name: name.value
    };
};
exports.parseFunction = parseFunction;
//# sourceMappingURL=parse.function.js.map