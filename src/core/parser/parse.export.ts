import {Parser} from "./index";
import {TODO} from "../../types/TODO";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {IExportNode} from "../../types/TFluxAST";
import {IToken} from "../../types/IToken";
import {AST_TYPES} from "../../constants/AST_TYPES";

export const parseExport = (parser: Parser): IExportNode => {
    parser.eat(TOKEN_TYPES.EXPORT);
    parser.eat(TOKEN_TYPES.LBRACE);
    let properties: IToken[] = []
    while (parser.currentToken.type !== TOKEN_TYPES.RBRACE){
        const property = parser.eat(TOKEN_TYPES.IDENT)
        properties.push(property)
        if (parser.currentToken.type === TOKEN_TYPES.COMMA){
            parser.eat(TOKEN_TYPES.COMMA);
        }else{
            break;
        }
    }
    parser.eat(TOKEN_TYPES.RBRACE);
    return {
        type: AST_TYPES.EXPORT,
        properties: properties
    }
}