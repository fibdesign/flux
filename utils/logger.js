// utils/logger.js

const FluxErrors = require("./FluxErros");
const Reset = '\x1b[0m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgRed = '\x1b[31m';

function logSuccess(msg, hasIcon = false) {
    console.log(FgGreen + (hasIcon ? '✅ ' : '') + msg + Reset);
}

function logInfo(msg, hasIcon = false) {
    console.log(FgBlue + (hasIcon ? 'ℹ️ ' : '') + msg + Reset);
}

function logWarning(msg, hasIcon = false) {
    console.warn(FgYellow + (hasIcon ? '⚠️ ' : '') + msg + Reset);
}

function logError(msg, hasIcon = false) {
    console.error(FgRed + (hasIcon ? '❌ ' : '') + msg + Reset);
}

function logSpinner(msg) {
    console.error(msg);
}

function throwTypeError(err, meta = undefined) {
    if (meta){
        console.log('this is meta:',meta)
    }
    FluxErrors.type({
        message: err,
        file: meta?.file ?? 'unknown file',
        line: meta?.line ?? 'unknown',
        column: meta?.column ?? 'unknown',
        code: `    ${meta?.code}`
    });
}
function throwError(err, meta = undefined) {
    if (meta){
        console.log('this is meta:',meta)
    }
    FluxErrors.runtime({
        message: err,
        file: meta?.file ?? 'unknown file',
        line: meta?.line ?? 'unknown',
        column: meta?.column ?? 'unknown',
        code: `    ${meta?.code}`
    });
}
function throwSyntaxError(err, meta = undefined) {
    FluxErrors.syntax({
        message: err,
        file: meta?.file ?? 'unknown file',
        line: meta?.line ?? 'unknown',
        column: meta?.column ?? 'unknown',
        code: `    ${meta?.code}`
    });

}
module.exports = { logSpinner,logSuccess,logInfo,logWarning,logError,throwTypeError,throwError,throwSyntaxError };