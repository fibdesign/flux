"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateObjectLiteral = void 0;
const evaluateObjectLiteral = (interpreter, node) => {
    const result = {};
    for (const property of node.properties) {
        const key = property.key.value;
        const value = interpreter.evaluate(property.value);
        result[key] = value;
    }
    return result;
};
exports.evaluateObjectLiteral = evaluateObjectLiteral;
//# sourceMappingURL=evaluate.object.literal.js.map