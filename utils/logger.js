// utils/logger.js

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

module.exports = { logSpinner,logSuccess,logInfo,logWarning,logError };