"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeFunction = void 0;
const executeFunction = (interpreter, node) => {
    const name = node.name;
    interpreter.Functions[name] = node;
};
exports.executeFunction = executeFunction;
//# sourceMappingURL=execute.function.js.map