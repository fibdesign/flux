"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseType = void 0;
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const parseType = (parser) => {
    const varType = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.TYPE);
    let nullable = false;
    if (parser.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.QUESTION) {
        parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.QUESTION);
        nullable = true;
    }
    const varName = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT);
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.EQUALS);
    const value = parser.parseExpression();
    let isConstant = false;
    if (parser.currentToken.type == TOKEN_TYPES_1.TOKEN_TYPES.AS) {
        parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.AS);
        parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.CONST);
        isConstant = true;
    }
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.SEMICOLON);
    return {
        type: AST_TYPES_1.AST_TYPES.TYPE,
        varType,
        varName,
        value,
        isConstant,
        nullable
    };
};
exports.parseType = parseType;
//# sourceMappingURL=parse.type.js.map