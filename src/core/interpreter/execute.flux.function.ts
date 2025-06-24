import {Interpreter} from "./index";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {IFunctionCallNode, TFluxASTNode} from "../../types/TFluxAST";

export const executeFluxFunction = (interpreter: Interpreter, name: string) => {
    const bootCallNode: IFunctionCallNode = {
        type: AST_TYPES.FUNCTION_CALL,
        expression: {
            type: AST_TYPES.IDENTIFIER,
            value: { type: 'identifier', value: name }
        },
        arguments: [],
    };

    interpreter.evaluate(bootCallNode);
}