// tokenizer.js

export function tokenize(code) {
    const tokenSpec = [
        ['TEMPLATE', /`[^`]*`/],
        ['STRING', /'[^']*'/],
        ['NUMBER', /\d+/],
        ['BOOLEAN', /\btrue\b|\bfalse\b/],
        ['TYPE', /\bstring\b|\bint\b|\bbool\b|\bvoid\b/],
        ['FN', /\bfn\b/],
        ['RETURN', /\breturn\b/],
        ['CONST', /\bconst\b/],
        ['AS', /\bas\b/],
        ['EMIT', /\bemit\b/],
        ['IDENT', /[a-zA-Z_][a-zA-Z0-9_]*/],
        ['ARROW', /=>/],
        ['EQUALS', /=/],
        ['PLUS', /\+/],
        ['MINUS', /-/],
        ['STAR', /\*/],
        ['SLASH', /\//],
        ['SEMICOLON', /;/],
        ['COLON', /:/],
        ['COMMA', /,/],
        ['LPAREN', /\(/],
        ['RPAREN', /\)/],
        ['LBRACE', /\{/],
        ['RBRACE', /\}/],
        ['SKIP', /[ \t\r\n]+/],
        ['MISMATCH', /./],
    ];

    const tokens = [];
    let pos = 0;

    while (pos < code.length) {
        let match = null;

        for (const [type, regex] of tokenSpec) {
            regex.lastIndex = 0;
            const result = regex.exec(code.slice(pos));
            if (result && result.index === 0) {
                const value = result[0];
                if (type === 'SKIP') {
                    // do nothing
                } else if (type === 'MISMATCH') {
                    throw new Error(`Unexpected token at position ${pos}`);
                } else {
                    tokens.push([type, value]);
                }
                pos += value.length;
                match = true;
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
