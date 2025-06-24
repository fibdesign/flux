"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTemplate = void 0;
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const FluxErrorHandler_1 = require("../../utils/FluxErrorHandler");
const parseTemplate = (parser) => {
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.BACKTICK);
    const values = [];
    while (parser.currentToken.type !== TOKEN_TYPES_1.TOKEN_TYPES.BACKTICK) {
        switch (parser.currentToken.type) {
            case TOKEN_TYPES_1.TOKEN_TYPES.STRING:
                const strValue = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.STRING);
                values.push({
                    type: 'string',
                    value: strValue.value
                });
                break;
            case TOKEN_TYPES_1.TOKEN_TYPES.TEMPLATE_EXPR_START:
                parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.TEMPLATE_EXPR_START);
                const value = parser.parseExpression();
                parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.TEMPLATE_EXPR_END);
                values.push({
                    type: 'expression',
                    value
                });
                break;
            default:
                FluxErrorHandler_1.FluxErrorHandler.syntax(`Unexpected token in template literal: ${parser.currentToken.type}`, parser.currentToken.meta);
        }
    }
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.BACKTICK);
    return {
        type: AST_TYPES_1.AST_TYPES.TEMPLATE_LITERAL,
        values
    };
};
exports.parseTemplate = parseTemplate;
//# sourceMappingURL=parse.template.js.map