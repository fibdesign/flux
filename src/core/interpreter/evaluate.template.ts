import {Interpreter} from "./index";
import {ITemplateNode, TFluxASTNode} from "../../types/TFluxAST";
import {TFluxValue} from "../../types/TFluxValue";

export const evaluateTemplate = (interpreter: Interpreter, expression: ITemplateNode): TFluxValue => {

    const result: TFluxValue[] = []
    expression.values.forEach(value => {

        if (value.type === 'string'){
            result.push(value.value)
        }else{
            const expressionValue = interpreter.evaluate(value.value)
            if (expressionValue) result.push(expressionValue)
        }
    })
    return result.join('')
}