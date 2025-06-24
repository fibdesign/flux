"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXIT_CODES = void 0;
exports.EXIT_CODES = {
    SUCCESS: 0, // Execution completed without error.
    GENERAL_ERROR: 1, // Unspecified runtime error or failure.
    SYNTAX_ERROR: 2, // Invalid syntax in the source code.
    SEMANTIC_ERROR: 3, // Valid syntax, but invalid meaning (e.g., undefined variable).
    RUNTIME_ERROR: 4, // Errors during execution (e.g., division by zero).
    IO_ERROR: 5, // File or I/O operation failed (e.g., file not found).
    CONFIG_ERROR: 6, // CLI config or options are invalid/missing.
    COMPILATION_ERROR: 7, // If your language has a compilation step before interpretation.
    INTERNAL_ERROR: 8, // Unhandled exception or bug in the interpreter.
    INTERRUPTED: 9, // Execution was manually interrupted (Ctrl+C).
};
//# sourceMappingURL=EXIT_CODES.js.map