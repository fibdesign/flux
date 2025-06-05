# flux.py

from tokenizer import tokenize
from parser import Parser
from interpreter import Interpreter
import json

with open('index.flux', 'r') as f:
    code = f.read()

tokens = tokenize(code)
parser = Parser(tokens)
ast = parser.parse()

interpreter = Interpreter(ast)
interpreter.run()

print('✅ Execution finished.\n🧠 Environment memory:')
print(json.dumps(interpreter.dump(), indent=2))
