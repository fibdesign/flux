// interpreter.js

import { getTypeName } from './types.js'; // We'll define this helper
import readline from 'readline';

export class Interpreter {
    constructor(ast) {
        this.ast = ast;
        this.environment = {}; // Global variables
        this.functions = {};
    }

    run() {
        // Step 1: collect functions
        for (const node of this.ast) {
            if (node.kind === 'function') {
                this.functions[node.name] = node;
            }
        }

        // Step 2: run top-level non-function code
        for (const node of this.ast) {
            if (node.kind !== 'function') {
                this.execute(node, this.environment);
            }
        }

        // Step 3: run boot function
        if (!this.functions.boot) {
            throw new Error("Missing required entry function 'boot()'");
        }

        this.callFunction('boot', [], {});
        console.log('✅ Execution finished.');
    }

    execute(stmt, env) {
        if (stmt.kind === 'emit') {
            console.log(this.evaluate(stmt.value, env));
        } else if (stmt.kind === 'var_declaration') {
            const value = this.evaluate(stmt.value, env);
            const actualType = getTypeName(value);
            if (actualType !== stmt.type) {
                throw new TypeError(`Type mismatch: expected ${stmt.type}, got ${actualType}`);
            }

            if (env[stmt.name] && env[stmt.name].const) {
                throw new Error(`Cannot reassign constant '${stmt.name}'`);
            }

            env[stmt.name] = {
                type: stmt.type,
                value,
                const: stmt.const
            };
        } else if (stmt.kind === 'expression_statement') {
            this.evaluate(stmt.expression, env); // Evaluate function call
        } else if (stmt.kind === 'return') {
            const value = this.evaluate(stmt.value, env);
            throw { return: value }; // Use an exception for control flow
        } else {
            throw new Error('Unknown statement kind: ' + stmt.kind);
        }
    }

    evaluate(expr, env) {
        if (Array.isArray(expr)) {
            const [kind, val] = expr;
            if (kind === 'STRING') return val.slice(1, -1);
            if (kind === 'TEMPLATE') {
                return val.slice(1, -1).replace(/\{\{(.+?)\}\}/g, (_, name) => {
                    if (!(name in env)) throw new Error(`Variable '${name}' not found`);
                    return env[name].value;
                });
            }
            if (kind === 'NUMBER') return parseInt(val);
            if (kind === 'BOOLEAN') return val === 'true';
            if (kind === 'IDENT') {
                if (!(val in env)) throw new Error(`Variable '${val}' not defined`);
                return env[val].value;
            }
        }

        if (expr.type === 'binary_expression') {
            const left = this.evaluate(expr.left, env);
            const right = this.evaluate(expr.right, env);
            const op = expr.operator;
            if (op === '+') return left + right;
            if (op === '-') return left - right;
            if (op === '*') return left * right;
            if (op === '/') return left / right;
        }

        if (expr.type === 'function_call') {
            const args = expr.args.map(arg => this.evaluate(arg, env));
            return this.callFunction(expr.name, args, env);
        }

        throw new Error('Unknown expression type');
    }

    callFunction(name, args, callerEnv) {
        const fn = this.functions[name];
        if (!fn) throw new Error(`Function '${name}' not defined`);

        if (args.length !== fn.params.length) {
            throw new Error(`Function '${name}' expects ${fn.params.length} argument(s), got ${args.length}`);
        }

        const localEnv = { ...this.environment }; // isolate global scope
        for (let i = 0; i < fn.params.length; i++) {
            const { name, type } = fn.params[i];
            const value = args[i];
            const actual = getTypeName(value);
            if (type !== actual) {
                throw new TypeError(`Type mismatch for param '${name}': expected ${type}, got ${actual}`);
            }
            localEnv[name] = { type, value, const: true };
        }

        try {
            for (const stmt of fn.body) {
                this.execute(stmt, localEnv);
            }

            // If no return statement encountered:
            if (fn.returnType !== 'void') {
                throw new Error(`Function '${fn.name}' must return a value of type '${fn.returnType}'`);
            }

            // For void functions, it's fine to not return anything explicitly
            return undefined;

        } catch (e) {
            if (e.return !== undefined) {
                const actual = getTypeName(e.return);
                if (fn.returnType !== actual) {
                    throw new TypeError(`Function '${fn.name}' expected return type '${fn.returnType}', got '${actual}'`);
                }
                return e.return;
            } else {
                throw e;
            }
        }
    }

}
