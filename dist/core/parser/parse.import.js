"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseImport = void 0;
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const parseImport = (parser) => {
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.EXPORT);
    const name = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT);
    const path = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.STRING);
    let alias;
    if (parser.currentToken.type === TOKEN_TYPES_1.TOKEN_TYPES.ALIAS) {
        parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.ALIAS);
        alias = parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.IDENT);
    }
    parser.eat(TOKEN_TYPES_1.TOKEN_TYPES.SEMICOLON);
    return {
        type: AST_TYPES_1.AST_TYPES.IMPORT,
        path: path.value.slice(1, -1),
        name: alias?.value || name?.value
    };
};
exports.parseImport = parseImport;
//# sourceMappingURL=parse.import.js.map