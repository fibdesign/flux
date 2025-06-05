# parser.py

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

    def parse_emit(self):
        self.eat('EMIT')
        value_type, value = self.current()
        if value_type not in ('STRING', 'IDENT'):
            raise SyntaxError(f'Expected STRING or IDENT after emit, got {value_type}')
        self.position += 1
        self.eat('SEMICOLON')
        return {
            'kind': 'emit',
            'value': value
        }

    def parse_statement(self):
        var_type = self.eat('TYPE')
        var_name = self.eat('IDENT')
        self.eat('EQUALS')
        value_type, value = self.current()
        if value_type not in ('STRING', 'NUMBER', 'BOOLEAN'):
            raise SyntaxError(f'Expected STRING or NUMBER or BOOLEAN, got {value_type}')
        self.position += 1

        is_const = False
        if self.current()[0] == 'AS':
            self.eat('AS')
            self.eat('CONST')
            is_const = True

        self.eat('SEMICOLON')

        return {
            'type': var_type,
            'name': var_name,
            'value': value,
            'const': is_const
        }
