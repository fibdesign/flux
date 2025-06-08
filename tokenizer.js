// tokenizer.js

export function tokenize(code) {
    const tokenSpecification = [
        ['TEMPLATE', /`[^`]*`/y],
        ['STRING', /'[^']*'/y],
        ['NUMBER', /\d+/y],
        ['BOOLEAN', /\btrue\b|\bfalse\b/y],
        ['TYPE', /\bstring\b|\bint\b|\bbool\b/y],
        ['CONST', /\bconst\b/y],
        ['AS', /\bas\b/y],
        ['EMIT', /\bemit\b/y],
        ['IDENT', /[a-zA-Z_][a-zA-Z0-9_]*/y],
        ['EQUALS', /=/y],
        ['PLUS', /\+/y],
        ['MINUS', /-/y],
        ['STAR', /\*/y],
        ['SLASH', /\//y],
        ['SEMICOLON', /;/y],
        ['SKIP', /[ \t\r\n]+/y],
        ['MISMATCH', /./y]
    ];

    const tokens = [];
    let pos = 0;

    while (pos < code.length) {
        let match = null;
        for (const [name, regex] of tokenSpecification) {
            regex.lastIndex = pos;
            match = regex.exec(code);
            if (match && match.index === pos) {
                const value = match[0];
                if (name === 'SKIP') {
                    // skip whitespace
                } else if (name === 'MISMATCH') {
                    throw new Error(`Unexpected character: '${value}' at position ${pos}`);
                } else {
                    tokens.push([name, value]);
                }
                pos += value.length;
                break;
            }
        }
        if (!match) {
            throw new Error(`Unexpected token at position ${pos}`);
        }
    }
    tokens.push(['EOF', '']);
    return tokens;
}
