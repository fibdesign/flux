import {Interpreter} from "./index";
import {IAssignmentNode} from "../../types/TFluxAST";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";

export const executeAssignment = (interpreter: Interpreter, node: IAssignmentNode): void => {
    const name = node.name.value;

    if (!(name in interpreter.ENV)) {
        FluxErrorHandler.runtime(`Cannot assign to undefined variable '${name}'`, node.name.meta);
    }else if (interpreter.ENV[name]?.isConstant){
        FluxErrorHandler.runtime(`Cannot assign to a const variable '${name}'`, node.name.meta);
    }
    const newValue = interpreter.evaluate(node.expression);
    // how to check type of new value to be match to old type?
    if(!interpreter.checkTypeMatch(newValue,interpreter.ENV[name])){
        FluxErrorHandler.runtime(
            `Type mismatch: expected '${interpreter.ENV[name]?.type?.value}', got '${typeof newValue}'`,
            node.name.meta
        );
    }
    interpreter.ENV[name].value = newValue;

}