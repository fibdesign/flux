import {Interpreter} from "./index";
import {IMemberExpressionNode} from "../../types/TFluxAST";
import {TFluxValue, TFluxValueObject} from "../../types/TFluxValue";

export const evaluateMemberExpression = (interpreter: Interpreter, expression: IMemberExpressionNode): TFluxValue => {
    const obj = interpreter.evaluate(expression.object)
    const property = expression.property.value;

    if (
        obj !== null &&
        typeof obj === 'object' &&
        !Array.isArray(obj)
    ) {
        return (obj as TFluxValueObject)?.[property];
    }

    throw new Error(`Cannot access property '${property}' on non-object type`);
}