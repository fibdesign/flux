const { spawnSync } = require('child_process');
const { resolve } = require('path');

module.exports = function serveCommand(args) {
    const serverScript = resolve(__dirname, '../core/flux.js');
    spawnSync('node', [serverScript, 'serve', ...args], { stdio: 'inherit' });
};
