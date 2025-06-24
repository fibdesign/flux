"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateIdentifier = void 0;
const FluxErrorHandler_1 = require("../../utils/FluxErrorHandler");
const evaluateIdentifier = (interpreter, expression) => {
    const name = expression.value.value;
    if (!(name in interpreter.ENV)) {
        FluxErrorHandler_1.FluxErrorHandler.runtime(`Variable '${name}' is not defined`, expression.value.meta);
    }
    return interpreter.ENV[name]?.value;
};
exports.evaluateIdentifier = evaluateIdentifier;
//# sourceMappingURL=evaluate.identifier.js.map