import {ITemplateNode, TTemplateValue} from "../../types/TFluxAST";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {Parser} from "./index";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";

export const parseTemplate = (parser: Parser):ITemplateNode => {

    parser.eat(TOKEN_TYPES.BACKTICK)

    const values:TTemplateValue[] = []

    while (parser.currentToken.type !== TOKEN_TYPES.BACKTICK){
        switch (parser.currentToken.type) {
            case TOKEN_TYPES.STRING:
                const strValue = parser.eat(TOKEN_TYPES.STRING)
                values.push({
                    type: 'string',
                    value: strValue.value
                })
                break;
            case TOKEN_TYPES.TEMPLATE_EXPR_START:
                parser.eat(TOKEN_TYPES.TEMPLATE_EXPR_START)
                const value = parser.parseExpression()
                parser.eat(TOKEN_TYPES.TEMPLATE_EXPR_END)
                values.push({
                    type: 'expression',
                    value
                })
                break;
            default:
                FluxErrorHandler.syntax(
                    `Unexpected token in template literal: ${parser.currentToken.type}`,
                    parser.currentToken.meta)
        }
    }

    parser.eat(TOKEN_TYPES.BACKTICK)

    return {
        type: AST_TYPES.TEMPLATE_LITERAL,
        values
    }
}