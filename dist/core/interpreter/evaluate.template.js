"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateTemplate = void 0;
const evaluateTemplate = (interpreter, expression) => {
    const result = [];
    expression.values.forEach(value => {
        if (value.type === 'string') {
            result.push(value.value);
        }
        else {
            const expressionValue = interpreter.evaluate(value.value);
            if (expressionValue)
                result.push(expressionValue);
        }
    });
    return result.join('');
};
exports.evaluateTemplate = evaluateTemplate;
//# sourceMappingURL=evaluate.template.js.map