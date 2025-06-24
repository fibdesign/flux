"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStatement = void 0;
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const parse_emit_1 = require("./parse.emit");
const parse_return_1 = require("./parse.return");
const parse_type_1 = require("./parse.type");
const parse_assignment_1 = require("./parse.assignment");
const parse_expressionStatement_1 = require("./parse.expressionStatement");
const parseStatement = (parser) => {
    const handlers = {
        [TOKEN_TYPES_1.TOKEN_TYPES.RETURN]: () => (0, parse_return_1.parseReturn)(parser),
        [TOKEN_TYPES_1.TOKEN_TYPES.EMIT]: () => (0, parse_emit_1.parseEmit)(parser),
        [TOKEN_TYPES_1.TOKEN_TYPES.TYPE]: () => (0, parse_type_1.parseType)(parser),
        [TOKEN_TYPES_1.TOKEN_TYPES.IDENT]: () => {
            const name = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT);
            if (parser.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.EQUALS)
                return (0, parse_assignment_1.parseAssignment)(parser, name);
            parser.tokenIndex--;
            return (0, parse_expressionStatement_1.parseExpressionStatement)(parser);
        },
    };
    return handlers[parser.currentToken.type]
        ? handlers[parser.currentToken.type]()
        : (0, parse_expressionStatement_1.parseExpressionStatement)(parser);
};
exports.parseStatement = parseStatement;
//# sourceMappingURL=parse.statement.js.map