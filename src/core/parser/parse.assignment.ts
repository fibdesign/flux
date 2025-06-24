import {Parser} from "./index";
import {IToken} from "../../types/IToken";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {IAssignmentNode} from "../../types/TFluxAST";

export const parseAssignment = (parser: Parser, name: IToken):IAssignmentNode => {
    parser.eat(TOKEN_TYPES.EQUALS)
    const expression = parser.parseExpression()
    parser.eat(TOKEN_TYPES.SEMICOLON)

    return {
        type: AST_TYPES.ASSIGNMENT,
        expression,
        name
    }
}