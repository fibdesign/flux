import {Interpreter} from "./index";
import {ITypeNode} from "../../types/TFluxAST";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";

export const executeType = (interpreter: Interpreter, node: ITypeNode): void => {
    const value = interpreter.evaluate(node.value);
    const varName = node.varName.value;
    const declaredType = node.varType.value;

    if (!interpreter.checkTypeMatch(value, {
        type: node.varType,
        nullable: node.nullable,
        value: null,
        isConstant: false
    })) {
        FluxErrorHandler.runtime(
            `Type mismatch: expected '${declaredType}', got '${typeof value}'`,
            node.varName.meta
        );
    }

    interpreter.ENV[varName] = {
        type: node.varType,
        value,
        isConstant: node.isConstant,
        nullable: node.nullable
    }
}