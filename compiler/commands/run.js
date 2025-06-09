import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export function runCommand(args) {
    const projectRoot = process.cwd();
    const compilerPath = resolve(__dirname, '../flux.js');
    const commandArgs = args;

    spawnSync('node', [compilerPath, ...commandArgs], {
        stdio: 'inherit',
        env: { ...process.env, FLUX_PROJECT_ROOT: projectRoot }
    });
}
