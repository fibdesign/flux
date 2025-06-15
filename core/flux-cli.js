#!/usr/bin/env node

// core/flux-cli.js

const args = process.argv.slice(2);
const command = args[0];

// Static imports for pkg compatibility
const serveCommand = require('../commands/serve');
const versionCommand = require('../commands/version');
const newCommand = require('../commands/new');
const downloadCommand = require('../commands/download');

switch (command) {
    case 'serve':
        serveCommand(args.slice(1));
        break;
    case 'new':
        newCommand(args.slice(1));
        break;
    case 'download':
        downloadCommand(args.slice(1));
        break;
    case '-v':
    case '--version':
    case 'version':
        versionCommand();
        break;
    default:
        console.log('Flux CLI - Unknown command:', command);
        console.log('Available: run, serve, version');
}
