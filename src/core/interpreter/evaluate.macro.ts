import {Interpreter} from "./index";
import {IMacroNode} from "../../types/TFluxAST";
import {MACROS} from "../../constants/MACROS";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";

export const evaluateMacro = (interpreter: Interpreter, expression: IMacroNode) => {
    const name = expression.value.value;

    switch (name) {
        case MACROS.REQUEST:
            return interpreter.Macros.current_request;
        default:
            FluxErrorHandler.error(`Unknown macro: ${name}`, expression.value.meta);
    }
}