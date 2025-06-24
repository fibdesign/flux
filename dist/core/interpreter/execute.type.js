"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeType = void 0;
const FluxErrorHandler_1 = require("../../utils/FluxErrorHandler");
const executeType = (interpreter, node) => {
    const value = interpreter.evaluate(node.value);
    const varName = node.varName.value;
    const declaredType = node.varType.value;
    if (!interpreter.checkTypeMatch(value, {
        type: node.varType,
        nullable: node.nullable,
        value: null,
        isConstant: false
    })) {
        FluxErrorHandler_1.FluxErrorHandler.runtime(`Type mismatch: expected '${declaredType}', got '${typeof value}'`, node.varName.meta);
    }
    interpreter.ENV[varName] = {
        type: node.varType,
        value,
        isConstant: node.isConstant,
        nullable: node.nullable
    };
};
exports.executeType = executeType;
//# sourceMappingURL=execute.type.js.map