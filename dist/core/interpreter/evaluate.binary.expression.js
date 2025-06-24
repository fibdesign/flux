"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateBinaryExpression = void 0;
const FluxErrorHandler_1 = require("../../utils/FluxErrorHandler");
const evaluateBinaryExpression = (interpreter, expression) => {
    const operator = expression.operator;
    const left = interpreter.evaluate(expression.leftExpression);
    const right = interpreter.evaluate(expression.rightExpression);
    if (typeof left !== 'number' || typeof right !== 'number') {
        FluxErrorHandler_1.FluxErrorHandler.runtime(`Binary operator '${operator.value}' requires numbers`, operator.meta);
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
            FluxErrorHandler_1.FluxErrorHandler.error(`Unsupported binary operator: ${operator.value}`, operator.meta);
    }
};
exports.evaluateBinaryExpression = evaluateBinaryExpression;
//# sourceMappingURL=evaluate.binary.expression.js.map