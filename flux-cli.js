#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0];

// Static imports for pkg compatibility
const serveCommand = require('./commands/serve');
const versionCommand = require('./commands/version');
const newCommand = require('./commands/new');

switch (command) {
    case 'serve':
        serveCommand(args.slice(1));
        break;
    case 'new':
        newCommand(args.slice(1));
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
