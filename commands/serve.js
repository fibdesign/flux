const { spawn } = require('child_process');
const { resolve } = require('path');
const watch = require('node-watch');
const path = require('path');
const targetDir = process.cwd();
const Reset = '\x1b[0m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgRed = '\x1b[31m';
module.exports = function serveCommand(args) {
    const serverScript = resolve(__dirname, '../core/flux.js');

    let childProcess = null;

    function startServer() {
        if (childProcess) childProcess.kill();
        childProcess = spawn('node', [serverScript, 'serve', ...args], { stdio: 'inherit' });
    }

    startServer();

    process.env.__FLUX_BROWSER_OPENED__ = true;
    watch(targetDir, { recursive: true, filter: /\.flux$/ }, (evt, name) => {
        const date = new Date().toLocaleTimeString(undefined,{hour12: false})
        console.log(`${FgBlue}[${date}]${Reset} ${FgYellow}+1${Reset} ${FgGreen}files changed, restarting server...${Reset}`);
        startServer();
    });
};
