"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeAssignment = void 0;
const FluxErrorHandler_1 = require("../../utils/FluxErrorHandler");
const executeAssignment = (interpreter, node) => {
    const name = node.name.value;
    if (!(name in interpreter.ENV)) {
        FluxErrorHandler_1.FluxErrorHandler.runtime(`Cannot assign to undefined variable '${name}'`, node.name.meta);
    }
    else if (interpreter.ENV[name]?.isConstant) {
        FluxErrorHandler_1.FluxErrorHandler.runtime(`Cannot assign to a const variable '${name}'`, node.name.meta);
    }
    const newValue = interpreter.evaluate(node.expression);
    // how to check type of new value to be match to old type?
    if (!interpreter.checkTypeMatch(newValue, interpreter.ENV[name])) {
        FluxErrorHandler_1.FluxErrorHandler.runtime(`Type mismatch: expected '${interpreter.ENV[name]?.type?.value}', got '${typeof newValue}'`, node.name.meta);
    }
    interpreter.ENV[name].value = newValue;
};
exports.executeAssignment = executeAssignment;
//# sourceMappingURL=execute.assignment.js.map