from tokenizer import tokenize

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.position = 0
        self.ast = []

    def current(self):
        if self.position < len(self.tokens):
            return self.tokens[self.position]
        return ('EOF', '')

    def eat(self, expected_type):
        tok_type, tok_val = self.current()
        if tok_type == expected_type:
            self.position += 1
            return tok_val
        raise SyntaxError(f'Expected {expected_type}, got {tok_type}({tok_val})')

    def parse(self):
        while self.current()[0] != 'EOF':
            if self.current()[0] == 'EMIT':
                self.ast.append(self.parse_emit())
            else:
                self.ast.append(self.parse_statement())
        return self.ast

    def parse_expression(self):
        left_type, left_value = self.current()
        if left_type not in ('STRING', 'NUMBER', 'BOOLEAN', 'IDENT'):
            raise SyntaxError(f'Unexpected value {left_type}')
        self.position += 1

        if self.current()[0] in ('PLUS', 'MINUS', 'STAR', 'SLASH'):
            op_type = self.eat(self.current()[0])
            right_type, right_value = self.current()
            if right_type not in ('STRING', 'NUMBER', 'BOOLEAN', 'IDENT'):
                raise SyntaxError(f'Expected value after operator, got {right_type}')
            self.position += 1

            return {
                'type': 'binary_expression',
                'operator': op_type,
                'left': (left_type, left_value),
                'right': (right_type, right_value)
            }

        return (left_type, left_value)

    def parse_emit(self):
        self.eat('EMIT')
        value = self.parse_expression()
        self.eat('SEMICOLON')
        return {
            'kind': 'emit',
            'value': value
        }

    def parse_statement(self):
        var_type = self.eat('TYPE')
        var_name = self.eat('IDENT')
        self.eat('EQUALS')
        value_expr = self.parse_expression()

        # Validate type for simple expressions
        if isinstance(value_expr, tuple):
            value_type, _ = value_expr
            if value_type not in ('STRING', 'NUMBER', 'BOOLEAN', 'IDENT'):
                raise SyntaxError(f'Expected STRING or NUMBER or BOOLEAN, got {value_type}')
        elif isinstance(value_expr, dict):
            if value_expr.get('type') != 'binary_expression':
                raise SyntaxError(f'Invalid expression: {value_expr}')
        else:
            raise SyntaxError(f'Invalid expression format: {value_expr}')

        is_const = False
        if self.current()[0] == 'AS':
            self.eat('AS')
            self.eat('CONST')
            is_const = True

        self.eat('SEMICOLON')

        return {
            'type': var_type,
            'name': var_name,
            'value': value_expr,
            'const': is_const
        }
