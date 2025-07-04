import {Interpreter} from "./index";
import {IMacroCallNode} from "../../types/TFluxAST";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";
import {MACROS} from "../../constants/MACROS";
import {TFluxValue} from "../../types/TFluxValue";
import {IResponse} from "../../types/IResponse";
import {DEFAULT_ABORT_MESSAGES} from "../../constants/DEFAULT_ABORT_MESSAGES";
import fs from "fs";
import path from "node:path";

export const evaluateMacroCall = (interpreter: Interpreter, expression: IMacroCallNode) => {

    let functionExpression = expression.expression;

    if (functionExpression.type !== AST_TYPES.MACRO) {
        FluxErrorHandler.runtime("Only direct function calls by identifier are supported for now");
    }

    const name = functionExpression.value.value;

    const args = expression.arguments.map(arg => interpreter.evaluate(arg))

    switch (name) {
        case MACROS.ABORT:
            return handleAbort(args);
        case MACROS.Log:
            return handleLog(args);
        default:
            FluxErrorHandler.runtime(`Macro '${name}' not found`, functionExpression.value.meta)
    }
}
const handleAbort = (args: TFluxValue[]): never => {
    const status = args[0] as number || 500;
    const message = args[1] as string || DEFAULT_ABORT_MESSAGES[status] || 'Aborted';
    const errors = args[2] as any || null;
    const response: IResponse = {
        status,
        message,
        errors
    }
    throw {
        __flux_error_type: 'abort',
        response
    }
}

const handleLog = (args: TFluxValue[]) => {
    let [data, type] = args;
    const logPath = path.resolve(process.cwd(), 'storage/private/logs');
    if (!fs.existsSync(logPath)) fs.mkdirSync(logPath, {recursive: true});
    type = type ?? 'INF';

    const now = new Date();
    const time = now.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric',hour12: false});
    const date = [
        now.getDate().toString().padStart(2, '0'),
        (now.getMonth() + 1).toString().padStart(2, '0'),
        now.getFullYear().toString().slice(-2)
    ].join('-');

    const resultMsg = `[${date} ${time}] [${type}] ${typeof data === 'object' ? JSON.stringify(data) : data}\n`
    fs.appendFileSync(logPath+`/log-${date}.txt`, resultMsg)
    return resultMsg;
}