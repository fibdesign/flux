import {Interpreter} from "./index";
import {IObjectLiteralNode} from "../../types/TFluxAST";
import {TFluxValue, TFluxValueObject} from "../../types/TFluxValue";

export const evaluateObjectLiteral = (interpreter: Interpreter, node: IObjectLiteralNode): TFluxValueObject => {
    const result: Record<string, TFluxValue> = {};

    for (const property of node.properties) {
        const key = property.key.value;
        const value = interpreter.evaluate(property.value);
        result[key] = value;
    }

    return result;
}