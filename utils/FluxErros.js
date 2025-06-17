// utils/flux-errors.js
const FgRed = '\x1b[31m';
const Reset = '\x1b[0m';
const FgCyan = '\x1b[36m';
const FgYellow = '\x1b[33m';

class FluxErrors {
    static syntax({ message, file, line, column, code }) {
        const lineNumStr = String(line);
        const linePrefixLength = 3 + lineNumStr.length + 3; // space + pipe + space + lineNum + space + pipe + space

        const output =
            `${FgRed}Flux Syntax Error:${Reset} ${message}\n` +
            ` --> ${FgCyan}${file}:${line}:${column}${Reset}\n\n` +
            ` ${FgYellow}|${Reset}  ${line} | ${code.trim()}\n` +
            ` ${' '.repeat(linePrefixLength + column - 1)}${FgRed}^${Reset}`;

        console.error(output);
        process.exit(1);
    }

    static runtime({ message, file, line, column }) {
        const output =
            `${FgRed}Flux Runtime Error:${Reset} ${message}\n` +
            ` --> ${FgCyan}${file}:${line}:${column}${Reset}`;

        console.error(output);
        process.exit(1);
    }
    static type({ message, file, line, column, code }) {
        const lineNumStr = String(line);
        const linePrefixLength = 3 + lineNumStr.length + 3; // space + pipe + space + lineNum + space + pipe + space

        const output =
            `${FgRed}Flux Type Error:${Reset} ${message}\n` +
            ` --> ${FgCyan}${file}:${line}:${column}${Reset}\n\n` +
            ` ${FgYellow}|${Reset}  ${line} | ${code.trim()}\n` +
            ` ${' '.repeat(linePrefixLength + column - 1)}${FgRed}^${Reset}`;

        console.error(output);
        process.exit(1);
    }

    // Add more types (e.g., warning, info) as needed
}

module.exports = FluxErrors;
