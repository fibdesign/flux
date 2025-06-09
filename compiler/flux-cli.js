#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory of the current file (compiler folder)
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

const projectRoot = process.cwd();
const compilerPath = resolve(__dirname, 'flux.js');  // Correctly resolved path

switch (command) {
    case 'run':
        spawnSync('node', [compilerPath, ...commandArgs], {
            stdio: 'inherit',
            env: { ...process.env, FLUX_PROJECT_ROOT: projectRoot }
        });
        break;

    case 'serve':
        console.log('🚧 Serve command is not implemented yet');
        break;

    default:
        console.log('Usage: flux <run|serve>');
}
