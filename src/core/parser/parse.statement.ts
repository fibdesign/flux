import {Parser} from "./index";
import {TFluxASTNode} from "../../types/TFluxAST";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {parseEmit} from "./parse.emit";
import {parseReturn} from "./parse.return";
import {parseType} from "./parse.type";
import {parseAssignment} from "./parse.assignment";
import {parseExpressionStatement} from "./parse.expressionStatement";

export const parseStatement = (parser: Parser): TFluxASTNode => {
    const handlers: Record<string, () => TFluxASTNode> = {
        [TOKEN_TYPES.RETURN]: () => parseReturn(parser),
        [TOKEN_TYPES.EMIT]: () => parseEmit(parser),
        [TOKEN_TYPES.TYPE]: () => parseType(parser),
        [TOKEN_TYPES.IDENT]: () => {
            const name = parser.eat(TOKEN_TYPES.IDENT);
            if (parser.currentToken.type === TOKEN_TYPES.EQUALS)
                return parseAssignment(parser, name)
            parser.tokenIndex--;
            return parseExpressionStatement(parser);
        },
    }

    return handlers[parser.currentToken.type]
        ? handlers[parser.currentToken.type]()
        : parseExpressionStatement(parser)
}