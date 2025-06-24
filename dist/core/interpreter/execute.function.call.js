"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeFunctionCall = void 0;
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const FluxErrorHandler_1 = require("../../utils/FluxErrorHandler");
const executeFunctionCall = (interpreter, node) => {
    let functionExpression = node.expression;
    if (functionExpression.type !== AST_TYPES_1.AST_TYPES.IDENTIFIER) {
        FluxErrorHandler_1.FluxErrorHandler.runtime("Only direct function calls by identifier are supported for now");
    }
    const name = functionExpression.value.value;
    const funcEnv = interpreter.Functions[name];
    if (!funcEnv) {
        FluxErrorHandler_1.FluxErrorHandler.runtime(`Function '${name}' not found`, functionExpression.value.meta);
    }
    const args = node.arguments.map(arg => interpreter.evaluate(arg));
    if (funcEnv.params.length !== args.length) {
        FluxErrorHandler_1.FluxErrorHandler.runtime(`Function '${name}' expected ${funcEnv.params.length} args, got ${args.length}`);
    }
    const originalENV = { ...interpreter.ENV };
    interpreter.ENV = { ...interpreter.ENV };
    funcEnv.params.forEach((param, index) => {
        interpreter.ENV[param.name.value] = {
            type: param.type,
            value: args[index],
            nullable: false,
            isConstant: false,
        };
    });
    let returnValue = null;
    for (const bodyNode of funcEnv.body) {
        const result = interpreter.execute(bodyNode);
        if (result && result.__fluxReturn) {
            returnValue = result.__fluxReturn;
            break;
        }
    }
    if (!interpreter.checkTypeMatch(returnValue, {
        type: funcEnv.returnType,
        value: funcEnv.returnType.value,
        isConstant: false,
        nullable: funcEnv.returnType.value === 'void'
    })) {
        FluxErrorHandler_1.FluxErrorHandler.runtime(`Function '${name}' expected return ${funcEnv.returnType.value}, got ${typeof returnValue}`);
    }
    interpreter.ENV = originalENV;
    return returnValue;
};
exports.executeFunctionCall = executeFunctionCall;
//# sourceMappingURL=execute.function.call.js.map