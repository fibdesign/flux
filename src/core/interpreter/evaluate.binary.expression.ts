import {IBinaryExpressionNode} from "../../types/TFluxAST";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";
import {Interpreter} from "./index";

export const evaluateBinaryExpression = (interpreter: Interpreter, expression: IBinaryExpressionNode): number => {
    const operator = expression.operator;
    const left = interpreter.evaluate(expression.leftExpression);
    const right = interpreter.evaluate(expression.rightExpression);

    if (typeof left !== 'number' || typeof right !== 'number') {
        FluxErrorHandler.runtime(`Binary operator '${operator.value}' requires numbers`, operator.meta)
    }

    switch (operator.type) {
        case 'PLUS':
            return left + right;
        case 'MINUS':
            return left - right;
        case 'STAR':
            return left * right;
        case 'SLASH':
            return left / right;
        default:
            FluxErrorHandler.error(`Unsupported binary operator: ${operator.value}`, operator.meta)
    }
}