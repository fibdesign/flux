// interpreter.js

import { getTypeName } from './types.js'; // We'll define this helper
import readline from 'readline';
import {HTTPServer} from "./utils/http.js";

export class Interpreter {
    constructor(ast) {
        this.ast = ast;
        this.environment = {};
        this.functions = {};
        this.routers = []; // Add router storage
    }

    run() {
        // Step 1: collect functions and routers
        for (const node of this.ast) {
            if (node.kind === 'function') {
                this.functions[node.name] = node;
            } else if (node.kind === 'router') { // Add router collection
                this.routers.push(node);
            }
        }

        // Step 2: run top-level non-function/non-router code
        for (const node of this.ast) {
            if (node.kind !== 'function' && node.kind !== 'router') {
                this.execute(node, this.environment);
            }
        }

        // Step 3: run boot function
        if (!this.functions.boot) {
            throw new Error("Missing required entry function 'boot()'");
        }

        this.callFunction('boot', [], {});

        // Step 4: process routers after boot
        this.processRouters();
    }

    // Add this new method to handle router processing
    processRouters() {
        const flattenRoutes = (router, basePath = '', baseMiddlewares = []) => {
            const fullPath = basePath + router.basePath;
            const routes = [];

            for (const route of router.routes) {
                if (route.kind === 'router') {
                    routes.push(...flattenRoutes(
                        route,
                        fullPath,
                        [...baseMiddlewares, ...router.baseMiddlewares]
                    ));
                } else {
                    routes.push({
                        method: route.method,
                        path: fullPath + route.path,
                        middlewares: [...baseMiddlewares, ...router.baseMiddlewares, ...route.middlewares],
                        handler: route.handler
                    });
                }
            }
            return routes;
        };

        const finalRoutes = [];
        for (const router of this.routers) {
            const routes = flattenRoutes(router);
            for (const route of routes) {
                finalRoutes.push({
                    method: route.method,
                    path: route.path.replace(/(?<!^)\/+$/, ''),
                    handler: route.handler,
                    middlewares: route.middlewares
                });
            }
        }
        this.routers = finalRoutes;
        const server = new HTTPServer(this);
        server.listen();
    }

    execute(stmt, env) {
        if (stmt.kind === 'emit') {
            console.log(this.evaluate(stmt.value, env));
        } else if (stmt.kind === 'var_declaration') {
            const value = this.evaluate(stmt.value, env);
            const actualType = getTypeName(value);
            // Special handling for object type
            if (stmt.type === 'object') {
                if (actualType !== 'object') {
                    throw new TypeError(`Type mismatch: expected object, got ${actualType}`);
                }
            } else if (actualType !== stmt.type) {
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
            this.evaluate(stmt.expression, env);
        } else if (stmt.kind === 'return') {
            const value = this.evaluate(stmt.value, env);
            throw { return: value };
        } else if (stmt.kind === 'router') {
            // Do nothing - processed separately in processRouters()
        }else if (stmt.kind === 'assignment') {
            // Handle assignment statement
            if (!(stmt.name in env)) {
                throw new Error(`Variable '${stmt.name}' not defined`);
            }
            if (env[stmt.name].const) {
                throw new Error(`Cannot reassign constant '${stmt.name}'`);
            }

            const value = this.evaluate(stmt.expression, env);
            const actualType = getTypeName(value);
            if (actualType !== env[stmt.name].type) {
                throw new TypeError(`Type mismatch for '${stmt.name}': expected ${env[stmt.name].type}, got ${actualType}`);
            }

            env[stmt.name].value = value;
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

        if (expr.type) {
            switch (expr.type) {
                case 'binary_expression':
                    const left = this.evaluate(expr.left, env);
                    const right = this.evaluate(expr.right, env);
                    const op = expr.operator;
                    if (op === '+') return left + right;
                    if (op === '-') return left - right;
                    if (op === '*') return left * right;
                    if (op === '/') return left / right;
                    break;

                case 'function_call':
                    const args = expr.args.map(arg => this.evaluate(arg, env));
                    return this.callFunction(expr.name, args, env);

                case 'object_literal':
                    const obj = {};
                    for (const prop of expr.properties) {
                        const key = prop.key; // Already an identifier string
                        obj[key] = this.evaluate(prop.value, env);
                    }
                    return obj;

                case 'member_expression':
                    const object = this.evaluate(expr.object, env);
                    const property = expr.property;

                    if (typeof object !== 'object' || object === null) {
                        throw new Error(`Cannot read property '${property}' of non-object`);
                    }

                    if (!(property in object)) {
                        throw new Error(`Property '${property}' not found`);
                    }

                    return object[property];

                default:
                    throw new Error('Unknown expression type: ' + expr.type);
            }
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
