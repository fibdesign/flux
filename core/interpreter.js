// core/interpreter.js

const { getTypeName } = require('../utils/types.js');
const {HTTPServer} = require("../utils/http");
const path = require('node:path');
const { readFileSync } = require('node:fs');
const { tokenize } = require('./tokenizer');
const { Parser } = require('./parser');
const projectRoot = process.env.FLUX_PROJECT_ROOT || path.resolve('.');
const coreDir = __dirname;

class Interpreter {
    constructor(ast) {
        this.ast = ast;
        this.environment = {};
        this.functions = {};
        this.routers = []; // Add router storage
        this.exports = new Set();
        this.moduleCache = new Map();
        this.currentFile = null;
    }

    runModule(ast, filePath) {
        this.currentFile = filePath;
        this.fileDir = path.dirname(filePath);

        // Reset module-specific state
        this.environment = {};
        this.functions = {};
        this.routers = [];
        this.exports = new Set();

        // Collect functions and routers
        for (const node of ast) {
            if (node.kind === 'function') {
                this.functions[node.name] = node;
            } else if (node.kind === 'router') {
                this.routers.push(node);
            }
        }

        // Execute top-level code
        for (const node of ast) {
            if (node.kind !== 'function' && node.kind !== 'router' && node.kind !== 'export') {
                this.execute(node, this.environment);
            }
        }

        // Process exports
        for (const node of ast) {
            if (node.kind === 'export') {
                for (const name of node.exports) {
                    if (!(name in this.environment) && !(name in this.functions)) {
                        throw new Error(`Cannot export '${name}': not defined`);
                    }
                    this.exports.add(name);
                }
            }
        }

        return {
            environment: this.environment,
            functions: this.functions,
            exports: this.exports,
            routers: this.routers
        };
    }
    finalize() {
        this.processRouters();
        if (this.functions.boot) {
            this.callFunction('boot', [], {});
        }
    }

    resolveModule(importPath) {
        if (importPath.startsWith('@/')) {
            // Project-relative import
            return path.resolve(projectRoot, importPath.slice(2));
        } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
            // Relative to current file
            return path.resolve(this.fileDir, importPath);
        } else {
            // Core module
            return path.resolve(coreDir, importPath);
        }
    }
    loadModule(importPath) {
        const resolvedPath = this.resolveModule(importPath);

        // Check cache
        if (this.moduleCache.has(resolvedPath)) {
            return this.moduleCache.get(resolvedPath);
        }

        // Read and parse module
        const code = readFileSync(resolvedPath, 'utf-8');
        const tokens = tokenize(code);
        const parser = new Parser(tokens);
        const ast = parser.parse();

        // Create new interpreter for module
        const moduleInterpreter = new Interpreter();
        moduleInterpreter.moduleCache = this.moduleCache; // Share cache
        const module = moduleInterpreter.runModule(ast, resolvedPath);

        // Cache and return
        this.moduleCache.set(resolvedPath, module);
        return module;
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
        }else if (stmt.kind === 'import') {
            const module = this.loadModule(stmt.path);
            const namespace = {};

            // Create namespace with exported values
            for (const name of module.exports) {
                if (name in module.environment) {
                    namespace[name] = module.environment[name].value;
                } else if (name in module.functions) {
                    // Create bound function
                    namespace[name] = (...args) => {
                        const tempInterpreter = new Interpreter();
                        tempInterpreter.environment = module.environment;
                        tempInterpreter.functions = module.functions;
                        return tempInterpreter.callFunction(name, args, tempInterpreter.environment);
                    };
                }
            }

            // Register namespace
            const alias = stmt.alias || stmt.namespace;
            env[alias] = {
                type: 'object',
                value: namespace,
                const: true
            };
        } else if (stmt.kind === 'export') {
            // Handled in runModule
        }  else if (stmt.kind === 'expression_statement') {
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
    serializeValue(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';

        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, (key, val) => {
                    if (typeof val === 'function') return '[Function]';
                    return val;
                }, 2);
            } catch (e) {
                return '[Object]';
            }
        }

        return String(value);
    }
    evaluate(expr, env) {
        if (Array.isArray(expr)) {
            const [kind, val] = expr;
            if (kind === 'STRING') return val.slice(1, -1);
            if (kind === 'TEMPLATE') {
                const template = val.slice(1, -1);
                return template.replace(/\{\{(.+?)\}\}/g, (_, expr) => {
                    try {
                        const tokens = tokenize(expr.trim());
                        if (tokens.length === 1 && tokens[0][0] === 'EOF') {
                            return '';  // Empty expression
                        }
                        const parser = new Parser(tokens);
                        const parsedExpr = parser.parseExpression();
                        const value = this.evaluate(parsedExpr, env);
                        return this.serializeValue(value);
                    } catch (error) {
                        console.error(`Error in template expression '{{${expr}}}':`, error);
                        return `[ERROR: ${error.message}]`;
                    }
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
                    // Evaluate the callee (could be identifier or member expression)
                    const callee = this.evaluate(expr.callee, env);
                    const args = expr.arguments.map(arg => this.evaluate(arg, env));

                    // Handle different callee types
                    if (typeof callee === 'function') {
                        return callee(...args);
                    } else if (typeof callee === 'object' && callee.__fluxCall) {
                        return callee.__fluxCall(args);
                    }
                    throw new Error(`Cannot call '${callee}' as a function`);

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

module.exports = { Interpreter };