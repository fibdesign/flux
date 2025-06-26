import {Interpreter} from "./index";
import {IMacroCallNode} from "../../types/TFluxAST";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";
import {MACROS} from "../../constants/MACROS";
import {TFluxValue} from "../../types/TFluxValue";
import {IResponse} from "../../types/IResponse";
import {DEFAULT_ABORT_MESSAGES} from "../../constants/DEFAULT_ABORT_MESSAGES";

export const evaluateMacroCall = (interpreter: Interpreter, expression: IMacroCallNode) => {

    let functionExpression = expression.expression;

    if (functionExpression.type !== AST_TYPES.MACRO) {
        FluxErrorHandler.runtime("Only direct function calls by identifier are supported for now");
    }

    const name = functionExpression.value.value;

    const args = expression.arguments.map(arg => interpreter.evaluate(arg))

    switch (name) {
        case MACROS.ABORT:
            return handleAbort(args)
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