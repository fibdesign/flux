import {ITokenMeta} from "../types/IToken";
import {EXIT_CODES} from "../constants/EXIT_CODES";
import {COLORS} from "../constants/COLORS";

export class FluxErrorHandler {
    static error(msg: string, meta?: ITokenMeta, code: number = EXIT_CODES.GENERAL_ERROR): never {
        console.error(COLORS.Red+msg+COLORS.Reset)
        process.exit(code ?? EXIT_CODES.GENERAL_ERROR)
    }

    static syntax(msg: string, meta?: ITokenMeta, code: number = EXIT_CODES.SYNTAX_ERROR): never {
        console.error(msg, meta)
        process.exit(code ?? EXIT_CODES.GENERAL_ERROR)
    }

    static runtime(msg: string, meta?: ITokenMeta, code: number = EXIT_CODES.RUNTIME_ERROR): never {
        const TITLE = '[Runtime Error]'
        const POS = (meta?.line) ? `[${meta.line}${meta?.column ? `:${meta.column}` : ''}]` : ''
        console.log()
        console.error(`${COLORS.Red}${TITLE}${POS}${COLORS.Reset}`);
        console.error(`    ${COLORS.Red}└──${COLORS.Reset} ${msg}`);
        console.log()
        if (meta) {
            const { line, column, codeLine } = meta;
            if (codeLine) {
                console.log(`${COLORS.Yellow}|${COLORS.Dim}  ${line ?? -1} |${COLORS.Reset}${COLORS.Cyan} ${codeLine.trim()}${COLORS.Reset}`)
                if (column) {
                    console.error('         ' + ' '.repeat(column - 1) + `${COLORS.Red}^${COLORS.Reset}`);
                }
            }
        }

        process.exit(code ?? EXIT_CODES.GENERAL_ERROR)
    }

    static HttpError(res:any, status: number, message?: string){
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = status;
        return res.end(JSON.stringify({
            status: status,
            message: message
        }));
    }
}