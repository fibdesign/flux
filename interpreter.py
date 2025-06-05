# interpreter.py

class Interpreter:
    def __init__(self, ast):
        self.ast = ast
        self.environment = {}

    def run(self):
        for statement in self.ast:
            self.execute(statement)

    def execute(self, stmt):
        var_type = stmt['type']
        name = stmt['name']
        value = stmt['value']
        is_const = stmt['const']

        # Type check
        if var_type == 'int':
            if not value.isdigit():
                raise TypeError(f"Expected int for '{name}', got {value}")
            value = int(value)

        elif var_type == 'string':
            if not (value.startswith("'") and value.endswith("'")):
                raise TypeError(f"Expected string for '{name}', got {value}")
            value = value[1:-1]  # حذف کوتیشن‌ها

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
