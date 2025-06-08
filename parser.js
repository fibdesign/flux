// parser.js

export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
        this.ast = [];
    }

    current() {
        return this.position < this.tokens.length
            ? this.tokens[this.position]
            : ['EOF', ''];
    }

    eat(expectedType) {
        const [tokType, tokVal] = this.current();
        if (tokType === expectedType) {
            this.position++;
            return tokVal;
        }
        throw new SyntaxError(`Expected ${expectedType}, got ${tokType}(${tokVal})`);
    }

    parse() {
        while (this.current()[0] !== 'EOF') {
            if (this.current()[0] === 'EMIT') {
                this.ast.push(this.parseEmit());
            } else {
                this.ast.push(this.parseStatement());
            }
        }
        return this.ast;
    }

    parseExpression() {
        const [leftType, leftValue] = this.current();
        if (!['STRING', 'TEMPLATE', 'NUMBER', 'BOOLEAN', 'IDENT'].includes(leftType)) {
            throw new SyntaxError(`Unexpected value ${leftType}`);
        }
        this.position++;

        if (['PLUS', 'MINUS', 'STAR', 'SLASH'].includes(this.current()[0])) {
            const opType = this.eat(this.current()[0]);
            const [rightType, rightValue] = this.current();
            if (!['STRING', 'TEMPLATE', 'NUMBER', 'BOOLEAN', 'IDENT'].includes(rightType)) {
                throw new SyntaxError(`Expected value after operator, got ${rightType}`);
            }
            this.position++;
            return {
                type: 'binary_expression',
                operator: opType,
                left: [leftType, leftValue],
                right: [rightType, rightValue]
            };
        }

        return [leftType, leftValue];
    }

    parseEmit() {
        this.eat('EMIT');
        const [valueType, value] = this.current();
        if (!['STRING', 'TEMPLATE', 'IDENT'].includes(valueType)) {
            throw new SyntaxError(`Expected STRING, TEMPLATE, or IDENT after emit, got ${valueType}`);
        }
        this.position++;
        this.eat('SEMICOLON');
        return {
            kind: 'emit',
            value: [valueType, value]
        };
    }

    parseStatement() {
        const varType = this.eat('TYPE');
        const varName = this.eat('IDENT');
        this.eat('EQUALS');
        const value = this.parseExpression();
        let isConst = false;
        if (this.current()[0] === 'AS') {
            this.eat('AS');
            this.eat('CONST');
            isConst = true;
        }
        this.eat('SEMICOLON');
        return {
            type: varType,
            name: varName,
            value: value,
            const: isConst
        };
    }
}
