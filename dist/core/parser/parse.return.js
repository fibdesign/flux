"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReturn = void 0;
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const parseReturn = (parser) => {
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.RETURN);
    const value = parser.parseExpression();
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.SEMICOLON);
    return {
        type: AST_TYPES_1.AST_TYPES.RETURN,
        value
    };
};
exports.parseReturn = parseReturn;
//# sourceMappingURL=parse.return.js.map