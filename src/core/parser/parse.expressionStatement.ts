import {Parser} from "./index";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {IExpressionStatementNode} from "../../types/TFluxAST";
import {AST_TYPES} from "../../constants/AST_TYPES";

export const parseExpressionStatement = (parser: Parser):IExpressionStatementNode => {
    const expression = parser.parseExpression()
    parser.eat(TOKEN_TYPES.SEMICOLON)

    return {
        type: AST_TYPES.EXPRESSION_STATEMENT,
        expression
    }
}