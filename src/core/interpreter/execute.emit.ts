import {Interpreter} from "./index";
import {IEmitNode, TFluxASTNode} from "../../types/TFluxAST";

export const executeEmit = (interpreter: Interpreter, node: IEmitNode): void => {
    const value = interpreter.evaluate(node.value)
    console.log(value)
}