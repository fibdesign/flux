"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluxErrorHandler = void 0;
const EXIT_CODES_1 = require("../constants/EXIT_CODES");
const COLORS_1 = require("../constants/COLORS");
class FluxErrorHandler {
    static error(msg, meta, code = EXIT_CODES_1.EXIT_CODES.GENERAL_ERROR) {
        console.error(COLORS_1.COLORS.Red + msg + COLORS_1.COLORS.Reset);
        process.exit(code ?? EXIT_CODES_1.EXIT_CODES.GENERAL_ERROR);
    }
    static syntax(msg, meta, code = EXIT_CODES_1.EXIT_CODES.SYNTAX_ERROR) {
        console.error(msg, meta);
        process.exit(code ?? EXIT_CODES_1.EXIT_CODES.GENERAL_ERROR);
    }
    static runtime(msg, meta, code = EXIT_CODES_1.EXIT_CODES.RUNTIME_ERROR) {
        const TITLE = '[Runtime Error]';
        const POS = (meta?.line) ? `[${meta.line}${meta?.column ? `:${meta.column}` : ''}]` : '';
        console.log();
        console.error(`${COLORS_1.COLORS.Red}${TITLE}${POS}${COLORS_1.COLORS.Reset}`);
        console.error(`    ${COLORS_1.COLORS.Red}└──${COLORS_1.COLORS.Reset} ${msg}`);
        console.log();
        if (meta) {
            const { line, column, codeLine } = meta;
            if (codeLine) {
                console.log(`${COLORS_1.COLORS.Yellow}|${COLORS_1.COLORS.Dim}  ${line ?? -1} |${COLORS_1.COLORS.Reset}${COLORS_1.COLORS.Cyan} ${codeLine.trim()}${COLORS_1.COLORS.Reset}`);
                if (column) {
                    console.error('         ' + ' '.repeat(column - 1) + `${COLORS_1.COLORS.Red}^${COLORS_1.COLORS.Reset}`);
                }
            }
        }
        process.exit(code ?? EXIT_CODES_1.EXIT_CODES.GENERAL_ERROR);
    }
    static HttpError(res, status, message) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = status;
        return res.end(JSON.stringify({
            status: status,
            message: message
        }));
    }
}
exports.FluxErrorHandler = FluxErrorHandler;
//# sourceMappingURL=FluxErrorHandler.js.map