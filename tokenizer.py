# tokenizer.py

import re

token_spec = [
    ('TYPE',    r'\b(int|string|bool|array|object)\b'),
    ('AS',      r'\bas\b'),
    ('CONST',   r'\bconst\b'),
    ('EMIT',     r'\bemit\b'),
    ('BOOLEAN', r'\b(true|false)\b'),
    ('IDENT',   r'[a-zA-Z_][a-zA-Z0-9_]*'),
    ('STRING',  r"'[^']*'"),
    ('NUMBER',  r'\b\d+\b'),
    ('EQUALS',  r'='),
    ('SEMICOLON', r';'),
    ('SKIP',    r'[ \t]+'),
    ('MISMATCH',r'.'),
]

token_regex = '|'.join(f'(?P<{name}>{pattern})' for name, pattern in token_spec)

def tokenize(code):
    tokens = []
    for match in re.finditer(token_regex, code):
        kind = match.lastgroup
        value = match.group()
        if kind == 'SKIP':
            continue
        elif kind == 'MISMATCH':
            raise SyntaxError(f'Unexpected character {value!r}')
        elif kind == 'BOOLEAN':
            value = True if value == 'true' else False
            tokens.append((kind, value))
        else:
            tokens.append((kind, value))
    return tokens
