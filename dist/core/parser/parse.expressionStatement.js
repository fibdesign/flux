"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExpressionStatement = void 0;
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const parseExpressionStatement = (parser) => {
    const expression = parser.parseExpression();
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.SEMICOLON);
    return {
        type: AST_TYPES_1.AST_TYPES.EXPRESSION_STATEMENT,
        expression
    };
};
exports.parseExpressionStatement = parseExpressionStatement;
//# sourceMappingURL=parse.expressionStatement.js.map