# tokenizer.py

import re

def tokenize(code):
    token_specification = [
        ('TEMPLATE', r'`[^`]*`'),
        ('STRING',   r"'[^']*'"),
        ('NUMBER',   r'\d+'),
        ('BOOLEAN',  r'\btrue\b|\bfalse\b'),
        ('TYPE',     r'\bstring\b|\bint\b|\bbool\b'),
        ('CONST',    r'\bconst\b'),
        ('AS',       r'\bas\b'),
        ('EMIT',     r'\bemit\b'),
        ('IDENT',    r'[a-zA-Z_][a-zA-Z0-9_]*'),
        ('EQUALS',   r'='),
        ('PLUS',     r'\+'),
        ('MINUS',    r'-'),
        ('STAR',     r'\*'),
        ('SLASH',    r'/'),
        ('SEMICOLON',r';'),
        ('SKIP',     r'[ \t\n]+'),
        ('MISMATCH', r'.'),
    ]
    tok_regex = '|'.join(f'(?P<{name}>{pattern})' for name, pattern in token_specification)
    get_token = re.compile(tok_regex).match
    pos = 0
    mo = get_token(code, pos)
    tokens = []
    while mo:
        kind = mo.lastgroup
        value = mo.group()
        if kind == 'SKIP':
            pass
        elif kind == 'MISMATCH':
            raise RuntimeError(f'Unexpected character: {value!r}')
        else:
            tokens.append((kind, value))
        pos = mo.end()
        mo = get_token(code, pos)
    tokens.append(('EOF', ''))
    return tokens