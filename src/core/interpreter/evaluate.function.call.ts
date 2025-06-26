import {IFunctionCallNode, TFluxASTNode} from "../../types/TFluxAST";
import {Interpreter} from "./index";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {TFluxValue} from "../../types/TFluxValue";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";
import {IFluxVariable} from "../../types/IFluxVariable";

export const evaluateFunctionCall = (interpreter: Interpreter, expression: IFunctionCallNode): TFluxValue => {

    let functionExpression = expression.expression;

    if (functionExpression.type !== AST_TYPES.IDENTIFIER) {
        FluxErrorHandler.runtime("Only direct function calls by identifier are supported for now");
    }

    const name = functionExpression.value.value;
    const funcEnv = interpreter.Functions[name];
    if (!funcEnv){
        FluxErrorHandler.runtime(`Function '${name}' not found`, functionExpression.value.meta)
    }

    const args = expression.arguments.map(arg => interpreter.evaluate(arg))

    if (funcEnv.params.length !== args.length) {
        FluxErrorHandler.runtime(`Function '${name}' expected ${funcEnv.params.length} args, got ${args.length}`)
    }

    const originalENV: Record<string, IFluxVariable> = {...interpreter.ENV}
    interpreter.ENV = {...interpreter.ENV}

    funcEnv.params.forEach((param, index) => {
        interpreter.ENV[param.name.value] = {
            type: param.type,
            value: args[index],
            nullable: false,
            isConstant: false,
        }
    })

    let returnValue: TFluxValue = null;

    for (const bodyNode of funcEnv.body){
        const result = interpreter.execute(bodyNode)
        if (result && result.__fluxReturn){
            returnValue = result.__fluxReturn;
            break;
        }
    }

    if (!interpreter.checkTypeMatch(returnValue, {
        type: funcEnv.returnType,
        value: funcEnv.returnType.value,
        isConstant: false,
        nullable: funcEnv.returnType.value === 'void'
    })){

        FluxErrorHandler.runtime(`Function '${name}' expected return ${funcEnv.returnType.value}, got ${typeof returnValue}`)
    }

    interpreter.ENV = originalENV;

    return returnValue;
}