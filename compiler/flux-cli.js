#!/usr/bin/env node

import {runCommand} from "./commands/run.js";
import {serveCommand} from "./commands/serve.js";
import {versionCommand} from "./commands/version.js";

const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

const commandDefinitions = [
    { names: ['run'], action: runCommand },
    { names: ['serve'], action: serveCommand },
    { names: ['version', '-version', '-v'], action: versionCommand },
];

const commands = {};
for (const cmd of commandDefinitions) {
    for (const name of cmd.names) {
        commands[name] = cmd.action;
    }
}

if (command && commands[command]) {
    commands[command](commandArgs);
} else {
    console.log('Usage: flux <run|serve|version>');
}