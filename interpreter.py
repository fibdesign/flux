# interpreter.py
import re

class Interpreter:
    def __init__(self, ast):
        self.ast = ast
        self.environment = {}

    def run(self):
        for statement in self.ast:
            if statement.get('kind') == 'emit':
                self.execute_emit(statement)
            else:
                self.execute(statement)

    def execute_emit(self, stmt):
        val_type, val = stmt['value']
        value = self.evaluate((val_type, val))
        print(value)

    def evaluate(self, expr):
        if isinstance(expr, tuple):
            kind, val = expr
            if kind == 'STRING':
                return val[1:-1]
            elif kind == 'TEMPLATE':
                content = val[1:-1]  # remove backticks
                def replacer(match):
                    var_name = match.group(1)
                    if var_name not in self.environment:
                        raise NameError(f'Variable {var_name} not defined')
                    return str(self.environment[var_name]['value'])
                return re.sub(r'\{\{(.+?)\}\}', replacer, content)
            elif kind == 'NUMBER':
                return int(val)
            elif kind == 'BOOLEAN':
                return val == 'true'
            elif kind == 'IDENT':
                if val not in self.environment:
                    raise NameError(f'Variable {val} not defined')
                return self.environment[val]['value']

        elif isinstance(expr, dict) and expr['type'] == 'binary_expression':
            left = self.evaluate(expr['left'])
            right = self.evaluate(expr['right'])
            op = expr['operator']
            if op == '+':
                return left + right
            elif op == '-':
                return left - right
            elif op == '*':
                return left * right
            elif op == '/':
                return left / right

        raise TypeError(f'Unsupported expression: {expr}')

    def execute(self, stmt):
        var_type = stmt['type']
        name = stmt['name']
        value = self.evaluate(stmt['value'])
        is_const = stmt['const']

        if name in self.environment and self.environment[name]['const']:
            raise ValueError(f"Cannot reassign constant variable '{name}'")

        self.environment[name] = {
            'type': var_type,
            'value': value,
            'const': is_const
        }
