"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeEmit = void 0;
const executeEmit = (interpreter, node) => {
    const value = interpreter.evaluate(node.value);
    console.log(value);
};
exports.executeEmit = executeEmit;
//# sourceMappingURL=execute.emit.js.map