"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAssignment = void 0;
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const parseAssignment = (parser, name) => {
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.EQUALS);
    const expression = parser.parseExpression();
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.SEMICOLON);
    return {
        type: AST_TYPES_1.AST_TYPES.ASSIGNMENT,
        expression,
        name
    };
};
exports.parseAssignment = parseAssignment;
//# sourceMappingURL=parse.assignment.js.map