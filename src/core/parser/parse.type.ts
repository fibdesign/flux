import {Parser} from "./index";
import {ITypeNode} from "../../types/TFluxAST";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {AST_TYPES} from "../../constants/AST_TYPES";

export const parseType = (parser: Parser): ITypeNode => {

    const varType = parser.eat(TOKEN_TYPES.TYPE);

    let nullable = false;
    if (parser.currentToken.type === TOKEN_TYPES.QUESTION){
        parser.eat(TOKEN_TYPES.QUESTION)
        nullable = true;
    }

    const varName = parser.eat(TOKEN_TYPES.IDENT);
    parser.eat(TOKEN_TYPES.EQUALS);
    const value = parser.parseExpression()

    let isConstant = false;

    if (parser.currentToken.type == TOKEN_TYPES.AS){
        parser.eat(TOKEN_TYPES.AS);
        parser.eat(TOKEN_TYPES.CONST);
        isConstant = true;
    }

    parser.eat(TOKEN_TYPES.SEMICOLON)

    return {
        type: AST_TYPES.TYPE,
        varType,
        varName,
        value,
        isConstant,
        nullable
    }
}