import {IIdentifierNode} from "../../types/TFluxAST";
import {Interpreter} from "./index";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";
import {TFluxValue} from "../../types/TFluxValue";

export const evaluateIdentifier = (interpreter: Interpreter,expression: IIdentifierNode): TFluxValue => {
    const name = expression.value.value;
    if (!(name in interpreter.ENV)) {
        FluxErrorHandler.runtime(`Variable '${name}' is not defined`, expression.value.meta)
    }
    return interpreter.ENV[name]?.value;
}