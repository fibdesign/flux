"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateLiteral = void 0;
const FluxErrorHandler_1 = require("../../utils/FluxErrorHandler");
const evaluateLiteral = (expression) => {
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
            FluxErrorHandler_1.FluxErrorHandler.runtime(`Unsupported literal type: ${type}`, expression.value.meta);
    }
};
exports.evaluateLiteral = evaluateLiteral;
//# sourceMappingURL=evaluate.literal.js.map