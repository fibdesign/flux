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
        val = self.evaluate(stmt['value'])
        print(val)

    def evaluate(self, expr):
        if isinstance(expr, tuple):  # مقدار ساده
            kind, val = expr
            if kind == 'STRING':
                return val[1:-1]
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

            # Type-safe operations
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

        # Type check
        if var_type == 'int':
            if not isinstance(value, int):
                raise TypeError(f"Expected int for '{name}', got {value}")
        elif var_type == 'string':
            if not isinstance(value, str):
                raise TypeError(f"Expected string for '{name}', got {value}")
        elif var_type == 'bool':
            if not isinstance(value, bool):
                raise TypeError(f"Expected bool for '{name}', got {value}")

        # ذخیره متغیر
        if name in self.environment and self.environment[name]['const']:
            raise ValueError(f"Cannot reassign constant variable '{name}'")

        self.environment[name] = {
            'type': var_type,
            'value': value,
            'const': is_const
        }

    def dump(self):
        return self.environment
