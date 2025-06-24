"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEmit = void 0;
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const parseEmit = (parser) => {
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.EMIT);
    const value = parser.parseExpression();
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.SEMICOLON);
    return {
        type: AST_TYPES_1.AST_TYPES.EMIT,
        value
    };
};
exports.parseEmit = parseEmit;
//# sourceMappingURL=parse.emit.js.map