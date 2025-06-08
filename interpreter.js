// interpreter.js

export class Interpreter {
    constructor(ast) {
        this.ast = ast;
        this.environment = {};
    }

    run() {
        for (const statement of this.ast) {
            if (statement.kind === 'emit') {
                this.executeEmit(statement);
            } else {
                this.execute(statement);
            }
        }
    }

    executeEmit(stmt) {
        const [valType, val] = stmt.value;
        const value = this.evaluate([valType, val]);
        console.log(value);
    }

    evaluate(expr) {
        if (Array.isArray(expr)) {
            const [kind, val] = expr;
            if (kind === 'STRING') {
                return val.slice(1, -1);
            } else if (kind === 'TEMPLATE') {
                const content = val.slice(1, -1); // remove backticks
                return content.replace(/\{\{(.+?)\}\}/g, (match, varName) => {
                    if (!(varName in this.environment)) {
                        throw new ReferenceError(`Variable ${varName} not defined`);
                    }
                    return String(this.environment[varName].value);
                });
            } else if (kind === 'NUMBER') {
                return Number(val);
            } else if (kind === 'BOOLEAN') {
                return val === 'true';
            } else if (kind === 'IDENT') {
                if (!(val in this.environment)) {
                    throw new ReferenceError(`Variable ${val} not defined`);
                }
                return this.environment[val].value;
            }
        } else if (typeof expr === 'object' && expr.type === 'binary_expression') {
            const left = this.evaluate(expr.left);
            const right = this.evaluate(expr.right);
            const op = expr.operator;
            if (op === '+') return left + right;
            if (op === '-') return left - right;
            if (op === '*') return left * right;
            if (op === '/') return left / right;
        }
        throw new TypeError(`Unsupported expression: ${JSON.stringify(expr)}`);
    }

    execute(stmt) {
        const varType = stmt.type;
        const name = stmt.name;
        const value = this.evaluate(stmt.value);
        const isConst = stmt.const;

        if (name in this.environment && this.environment[name].const) {
            throw new Error(`Cannot reassign constant variable '${name}'`);
        }

        this.environment[name] = {
            type: varType,
            value,
            const: isConst
        };
    }
}
