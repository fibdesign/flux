// tokenizer.js

export function tokenize(code) {
    const tokenSpec = [
        ['COMMENT', /#--[\s\S]*?--#/],
        ['SKIP', /[ \t\r\n]+/],
        ['ROUTER', /\brouter\b/],
        ['METHOD', /\b(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\b/],
        ['LBRACKET', /\[/],
        ['RBRACKET', /\]/],
        ['TEMPLATE', /`[^`]*`/],
        ['STRING', /'[^']*'/],
        ['NUMBER', /\d+/],
        ['BOOLEAN', /\btrue\b|\bfalse\b/],
        ['TYPE', /\bstring\b|\bint\b|\bbool\b|\bvoid\b|\bfluxReq\b|\bobject\b/],
        ['OBJECT', /\bobject\b/],
        ['FN', /\bfn\b/],
        ['RETURN', /\breturn\b/],
        ['CONST', /\bconst\b/],
        ['AS', /\bas\b/],
        ['EMIT', /\bemit\b/],
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
        ['DOT', /\./],
        ['LBRACE', /\{/],
        ['RBRACE', /\}/],
        ['IDENT', /[a-zA-Z_][a-zA-Z0-9_]*/],
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
                if (type === 'SKIP' || type === 'COMMENT') {
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
