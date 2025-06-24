import {Parser} from "./index";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {IReturnNode} from "../../types/TFluxAST";

export const parseReturn = (parser: Parser):IReturnNode => {
    parser.eat(TOKEN_TYPES.RETURN);
    const value = parser.parseExpression();
    parser.eat(TOKEN_TYPES.SEMICOLON);
    return {
        type: AST_TYPES.RETURN,
        value
    }
}