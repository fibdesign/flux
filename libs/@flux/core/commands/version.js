import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export function versionCommand() {
    const projectRoot = process.cwd();

    const projectJson = JSON.parse(readFileSync(join(projectRoot, 'flux.json'), 'utf8'));
    const coreVersionJson = JSON.parse(
        readFileSync(resolve(projectRoot, 'libs/@flux/core/version.json'), 'utf8')
    );

    console.log(`Flux Project: ${projectJson.name} v${projectJson.version}`);
    console.log(`Flux Core: ${coreVersionJson.name} v${coreVersionJson.version}`);
}
