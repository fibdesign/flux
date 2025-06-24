"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.EOF = void 0;
const tokenSpec_1 = require("./tokenSpec");
const FluxErrorHandler_1 = require("../../utils/FluxErrorHandler");
const TOKEN_TYPES_1 = require("../../constants/TOKEN_TYPES");
exports.EOF = {
    type: TOKEN_TYPES_1.TOKEN_TYPES.EOF,
    value: ''
};
const tokenize = (code) => {
    const tokens = [];
    let position = 0;
    let line = 1;
    let column = 0;
    let lineStartIndex = 0;
    let isInTemplate = false;
    let isInTemplateExpression = false;
    while (position < code.length) {
        let match = false;
        let spec;
        if (!isInTemplate) {
            spec = tokenSpec_1.tokenSpec; // normal code
        }
        else {
            if (isInTemplateExpression) {
                spec = tokenSpec_1.tokenSpec; // expression inside {{ }}
            }
            else {
                spec = tokenSpec_1.templateTokenSpec; // template literal text mode (outside {{ }})
            }
        }
        for (const { type, pattern } of spec) {
            pattern.lastIndex = 0;
            const patternResult = pattern.exec(code.slice(position));
            if (!(patternResult && patternResult.index === 0))
                continue;
            const value = patternResult[0];
            const tokenLine = line;
            const tokenColumn = column;
            const absoluteIndex = position;
            const lineEndIndex = code.indexOf('\n', absoluteIndex);
            const codeLine = code.slice(lineStartIndex, lineEndIndex !== -1 ? lineEndIndex : code.length);
            const lines = value.split('\n');
            if (lines.length > 1) {
                const newlines = lines.length - 1;
                line += lines.length - 1;
                column = lines[lines.length - 1].length;
                const lastNewlineIndex = code.lastIndexOf('\n', position + value.length - 1);
                lineStartIndex = lastNewlineIndex + 1;
            }
            else {
                column += value.length;
            }
            if (type === TOKEN_TYPES_1.TOKEN_TYPES.BACKTICK) {
                isInTemplate = !isInTemplate;
            }
            else if (type === TOKEN_TYPES_1.TOKEN_TYPES.TEMPLATE_EXPR_START) {
                if (!isInTemplate) {
                    FluxErrorHandler_1.FluxErrorHandler.error(`Unexpected '{{' outside template literal`, {
                        line: tokenLine,
                        column: tokenColumn,
                        codeLine: codeLine
                    });
                }
                isInTemplateExpression = true;
            }
            else if (type === TOKEN_TYPES_1.TOKEN_TYPES.TEMPLATE_EXPR_END) {
                if (!isInTemplateExpression) {
                    FluxErrorHandler_1.FluxErrorHandler.error(`Unexpected '}}' outside template expression`, {
                        line: tokenLine,
                        column: tokenColumn,
                        codeLine: codeLine
                    });
                }
                isInTemplateExpression = false;
            }
            if (type === TOKEN_TYPES_1.TOKEN_TYPES.SKIP || type === TOKEN_TYPES_1.TOKEN_TYPES.COMMENT) { }
            else if (type === TOKEN_TYPES_1.TOKEN_TYPES.MISMATCH)
                break;
            else
                tokens.push({
                    type: type,
                    value: value,
                    meta: {
                        line: tokenLine,
                        column: tokenColumn,
                        codeLine: codeLine
                    }
                });
            position += value.length;
            match = true;
            break;
        } // end for
        if (!match)
            FluxErrorHandler_1.FluxErrorHandler.error(`Unexpected token at position ${position}`);
    } // end wile
    tokens.push(exports.EOF);
    return tokens;
};
exports.tokenize = tokenize;
//# sourceMappingURL=index.js.map