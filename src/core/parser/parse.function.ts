import {Parser} from "./index";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {IToken} from "../../types/IToken";
import {parseStatement} from "./parse.statement";
import {IFunctionNode, TFluxASTNode} from "../../types/TFluxAST";
import {parseEmit} from "./parse.emit";
import {parseReturn} from "./parse.return";
import {AST_TYPES} from "../../constants/AST_TYPES";

export const parseFunction = (parser: Parser): IFunctionNode => {
    parser.eat(TOKEN_TYPES.FN)
    const name = parser.eat(TOKEN_TYPES.IDENT)
    parser.eat(TOKEN_TYPES.LPAREN)

    let params: { name: IToken, type: IToken }[] = [];

    while (parser.currentToken.type !== TOKEN_TYPES.RPAREN) {
        const paramName = parser.eat(TOKEN_TYPES.IDENT)
        parser.eat(TOKEN_TYPES.COLON)
        const paramType = parser.eat(TOKEN_TYPES.TYPE)
        params.push({
            name: paramName,
            type: paramType
        })
        if (parser.currentToken.type === TOKEN_TYPES.COMMA) {
            parser.eat(TOKEN_TYPES.COMMA)
        } else {
            break;
        }
    }
    parser.eat(TOKEN_TYPES.RPAREN)
    parser.eat(TOKEN_TYPES.ARROW)
    const type = parser.eat(TOKEN_TYPES.TYPE)
    parser.eat(TOKEN_TYPES.LBRACE)

    let body: TFluxASTNode[] = []

    while (parser.currentToken.type !== TOKEN_TYPES.RBRACE) {
        const handlers: Record<string, () => TFluxASTNode> = {
            [TOKEN_TYPES.RETURN]: () => parseReturn(parser),
            [TOKEN_TYPES.EMIT]: () => parseEmit(parser),
        }

        const treeObj = handlers[parser.currentToken.type]
            ? handlers[parser.currentToken.type]()
            : parseStatement(parser)

        body.push(treeObj)
    }

    parser.eat(TOKEN_TYPES.RBRACE)
    return {
        type: AST_TYPES.FUNCTION,
        body,
        returnType: type,
        params,
        name: name.value
    }
}