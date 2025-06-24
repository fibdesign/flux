"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const FluxErrorHandler_1 = require("../../utils/FluxErrorHandler");
const execute_emit_1 = require("./execute.emit");
const execute_type_1 = require("./execute.type");
const execute_assignment_1 = require("./execute.assignment");
const evaluate_literal_1 = require("./evaluate.literal");
const evaluate_binary_expression_1 = require("./evaluate.binary.expression");
const evaluate_identifier_1 = require("./evaluate.identifier");
const HTTPServer_1 = require("../../utils/server/HTTPServer");
const execute_function_call_1 = require("./execute.function.call");
const execute_function_1 = require("./execute.function");
const execute_flux_function_1 = require("./execute.flux.function");
const evaluate_template_1 = require("./evaluate.template");
const execute_router_1 = require("./execute.router");
const evaluate_object_literal_1 = require("./evaluate.object.literal");
class Interpreter {
    constructor() {
        this.AST = [];
        this.ENV = {};
        this.Functions = {};
        this.Routes = [];
        this.ENV = {};
        this.Functions = {};
        this.Routes = [];
    }
    run(ast) {
        this.AST = ast;
        for (const node of this.AST) {
            this.execute(node);
        }
    }
    async serve() {
        if ('boot' in this.Functions) {
            (0, execute_flux_function_1.executeFluxFunction)(this, 'boot');
        }
        const server = new HTTPServer_1.HTTPServer(this);
        await server.listen();
        if ('ready' in this.Functions) {
            (0, execute_flux_function_1.executeFluxFunction)(this, 'ready');
        }
    }
    execute(node) {
        switch (node.type) {
            case AST_TYPES_1.AST_TYPES.EMIT:
                (0, execute_emit_1.executeEmit)(this, node);
                break;
            case AST_TYPES_1.AST_TYPES.EXPRESSION_STATEMENT:
                this.evaluate(node.expression);
                break;
            case AST_TYPES_1.AST_TYPES.TYPE:
                (0, execute_type_1.executeType)(this, node);
                break;
            case AST_TYPES_1.AST_TYPES.ASSIGNMENT:
                (0, execute_assignment_1.executeAssignment)(this, node);
                break;
            case AST_TYPES_1.AST_TYPES.FUNCTION:
                (0, execute_function_1.executeFunction)(this, node);
                break;
            case AST_TYPES_1.AST_TYPES.ROUTER:
                (0, execute_router_1.executeRouter)(this, node);
                break;
            case AST_TYPES_1.AST_TYPES.RETURN: return { __fluxReturn: this.evaluate(node.value) };
        }
    }
    evaluate(expression) {
        if (expression.type === AST_TYPES_1.AST_TYPES.LITERAL) {
            return (0, evaluate_literal_1.evaluateLiteral)(expression);
        }
        if (expression.type === AST_TYPES_1.AST_TYPES.BINARY_EXPRESSION) {
            return (0, evaluate_binary_expression_1.evaluateBinaryExpression)(this, expression);
        }
        if (expression.type === AST_TYPES_1.AST_TYPES.IDENTIFIER) {
            return (0, evaluate_identifier_1.evaluateIdentifier)(this, expression);
        }
        if (expression.type === AST_TYPES_1.AST_TYPES.FUNCTION_CALL) {
            return (0, execute_function_call_1.executeFunctionCall)(this, expression);
        }
        if (expression.type === AST_TYPES_1.AST_TYPES.TEMPLATE_LITERAL) {
            return (0, evaluate_template_1.evaluateTemplate)(this, expression);
        }
        if (expression.type === 'fluxReq') {
            return expression;
        }
        if (expression.type === AST_TYPES_1.AST_TYPES.OBJECT_LITERAL) {
            return (0, evaluate_object_literal_1.evaluateObjectLiteral)(this, expression);
        }
        FluxErrorHandler_1.FluxErrorHandler.error(`Unknown expression type: ${expression.type}`);
    }
    checkTypeMatch(actualValue, declared) {
        const expected = declared.type.value;
        if (actualValue === null) {
            return declared.nullable;
        }
        if (typeof actualValue === 'object' && expected === 'object')
            return true;
        if (typeof actualValue === 'string' && expected === 'string')
            return true;
        if (typeof actualValue === 'number' && expected === 'int')
            return true;
        if (typeof actualValue === 'boolean' && expected === 'bool')
            return true;
        return false;
    }
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=index.js.map