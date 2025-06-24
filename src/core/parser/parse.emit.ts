import {Parser} from "./index";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {IEmitNode} from "../../types/TFluxAST";
import {AST_TYPES} from "../../constants/AST_TYPES";

export const parseEmit = (parser: Parser):IEmitNode => {
    parser.eat(TOKEN_TYPES.EMIT);
    const value = parser.parseExpression();
    parser.eat(TOKEN_TYPES.SEMICOLON)
    return {
        type: AST_TYPES.EMIT,
        value
    }
}