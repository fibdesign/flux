import {Parser} from "./index";
import {IMigrationNode} from "../../types/TFluxAST";
import {TOKEN_TYPES} from "../../constants/TOKEN_TYPES";
import {IMigrationColumn} from "../../types/IMigrationColumn";
import {AST_TYPES} from "../../constants/AST_TYPES";


const parseColumns = (parser: Parser): IMigrationColumn[] => {

    const columns: IMigrationColumn[] = [];

    while (parser.currentToken.type !== TOKEN_TYPES.RBRACE) {
        const name = parser.eat(TOKEN_TYPES.IDENT).value;
        let primary = false;
        let unique = false;
        let nullable = false;
        let type = ''
        let defaultValue: any = undefined;
        parser.eat(TOKEN_TYPES.COLON)
        const StringTypes = parser.eat(TOKEN_TYPES.STRING).value.slice(1,-1)
        const listTypes = StringTypes.split('|')

        for (const item of listTypes) {
            switch (item) {
                case 'primary': primary = true;break;
                case 'unique': unique = true;break;
                case 'nullable': nullable = true;break;
                default:
                    if (item.includes('default:')){
                        defaultValue = item.replace('default:', '');
                    }else{
                        type = item
                    }
            }
        }

        if (parser.currentToken.type === TOKEN_TYPES.COMMA) parser.eat(TOKEN_TYPES.COMMA);

        columns.push({
            name,
            type,
            options: {
                primary,
                unique,
                nullable,
                default: defaultValue
            }
        })
    }

    return columns;
}

const parseAction = (parser: Parser): any => {
    const action = parser.eat(TOKEN_TYPES.IDENT).value;
    const table = parser.eat(TOKEN_TYPES.STRING).value.slice(1, -1);
    let fields: IMigrationColumn[] = [];
    if (parser.currentToken.type === TOKEN_TYPES.ARROW) {
        parser.eat(TOKEN_TYPES.ARROW);
        parser.eat(TOKEN_TYPES.LBRACE);
        fields = parseColumns(parser);
        parser.eat(TOKEN_TYPES.RBRACE);
    }

    if (parser.currentToken.type === TOKEN_TYPES.COMMA) parser.eat(TOKEN_TYPES.COMMA);
    return {
        action,
        table,
        fields,
    }
}

const parseBlock = (parser: Parser) => {
    parser.eat(TOKEN_TYPES.IDENT)
    parser.eat(TOKEN_TYPES.ARROW)
    parser.eat(TOKEN_TYPES.LBRACE)

    const actions: any[] = []
    while (parser.currentToken.type !== TOKEN_TYPES.RBRACE) {
        actions.push(parseAction(parser))
    }

    parser.eat(TOKEN_TYPES.RBRACE)
    if (parser.currentToken.type === TOKEN_TYPES.COMMA) parser.eat(TOKEN_TYPES.COMMA);

    return actions
}

export const parseMigration = (parser: Parser): IMigrationNode => {
    parser.eat(TOKEN_TYPES.MIGRATION)
    const migrationName = parser.eat(TOKEN_TYPES.STRING).value
    parser.eat(TOKEN_TYPES.ARROW)
    parser.eat(TOKEN_TYPES.LBRACE)


    let dependencies: string[] = [];
    let up: any[] = [];
    let down: any[] = [];

    while (parser.currentToken.type !== TOKEN_TYPES.RBRACE) {
        const key = parser.currentToken.value;


        const handlers: Record<string, () => void> = {
            up: () => {up = parseBlock(parser)},
            down: () => {down = parseBlock(parser)},
            dependencies: () => {
                parser.eat(TOKEN_TYPES.IDENT)
                parser.eat(TOKEN_TYPES.ARROW)
                parser.eat(TOKEN_TYPES.LBRACE)

                while (parser.currentToken.type !== TOKEN_TYPES.RBRACE) {
                    dependencies.push(parser.eat(TOKEN_TYPES.STRING).value)
                    if (parser.currentToken.type === TOKEN_TYPES.COMMA) parser.eat(TOKEN_TYPES.COMMA);
                }
                parser.eat(TOKEN_TYPES.RBRACE)
            }
        }

        if (handlers[key]) {
            handlers[key]();
        } else {
            throw new Error(`Unknown key in migration block: ${key}`);
        }
    }

    parser.eat(TOKEN_TYPES.RBRACE)

    return {
        type: AST_TYPES.MIGRATION,
        name: migrationName,
        up,
        down,
        dependencies,
    }
}