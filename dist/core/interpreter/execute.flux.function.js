"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeFluxFunction = void 0;
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const executeFluxFunction = (interpreter, name) => {
    const bootCallNode = {
        type: AST_TYPES_1.AST_TYPES.FUNCTION_CALL,
        expression: {
            type: AST_TYPES_1.AST_TYPES.IDENTIFIER,
            value: { type: 'identifier', value: name }
        },
        arguments: [],
    };
    interpreter.evaluate(bootCallNode);
};
exports.executeFluxFunction = executeFluxFunction;
//# sourceMappingURL=execute.flux.function.js.map