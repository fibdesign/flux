import {Parser} from "./index";
import {TODO} from "../../types/TODO";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {IToken} from "../../types/IToken";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {IImportNode} from "../../types/TFluxAST";

export const parseImport = (parser: Parser): IImportNode => {
    parser.eat(TOKEN_TYPES.EXPORT)
    const name = parser.eat(TOKEN_TYPES.IDENT);
    const path = parser.eat(TOKEN_TYPES.STRING);
    let alias: IToken | undefined;
    if (parser.currentToken.type === TOKEN_TYPES.ALIAS){
        parser.eat(TOKEN_TYPES.ALIAS);
        alias = parser.eat(TOKEN_TYPES.IDENT)
    }
    parser.eat(TOKEN_TYPES.SEMICOLON)
    return {
        type: AST_TYPES.IMPORT,
        path: path.value.slice(1, -1),
        name: alias?.value || name?.value
    }
}