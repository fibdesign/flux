import {IFunctionNode, TFluxASTNode} from "../../types/TFluxAST";
import {Interpreter} from "./index";

export const executeFunction = (interpreter: Interpreter, node: IFunctionNode) => {
    const name = node.name;
    interpreter.Functions[name] = node;
}