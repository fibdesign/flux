"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExport = void 0;
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const parseExport = (parser) => {
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.EXPORT);
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.LBRACE);
    let properties = [];
    while (parser.currentToken.type !== TOKEN_TYPES_1.TOKEN_TYPES.RBRACE) {
        const property = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT);
        properties.push(property);
        if (parser.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.COMMA) {
            parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.COMMA);
        }
        else {
            break;
        }
    }
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.RBRACE);
    return {
        type: AST_TYPES_1.AST_TYPES.EXPORT,
        properties: properties
    };
};
exports.parseExport = parseExport;
//# sourceMappingURL=parse.export.js.map