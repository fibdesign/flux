import {ILiteralNode} from "../../types/TFluxAST";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";
import {TFluxValue} from "../../types/TFluxValue";

export const evaluateLiteral = (expression: ILiteralNode): TFluxValue => {
    const type = expression.value.type;
    const value = expression.value.value;

    switch (type) {
        case 'STRING':
            return value.includes(`'`) ? value.slice(1, -1) : value;
        case 'NUMBER':
            return parseFloat(value);
        case 'BOOLEAN':
            return value === 'true';
        case 'NULL':
            return null;

        default:
            FluxErrorHandler.runtime(`Unsupported literal type: ${type}`, expression.value.meta);
    }
}