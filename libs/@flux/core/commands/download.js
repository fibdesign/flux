import { promises as fs } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

const LIBS_FOLDER = 'libs';

function runGit(args, cwd) {
    const result = spawnSync('git', args, { stdio: 'inherit', cwd });
    if (result.status !== 0) {
        throw new Error(`Git command failed: git ${args.join(' ')}`);
    }
}

export async function downloadCommand() {
    const projectRoot = process.cwd();
    const fluxJsonPath = join(projectRoot, 'flux.json');
    const lockPath = join(projectRoot, 'flux-lock.json');

    const fluxJson = JSON.parse(await fs.readFile(fluxJsonPath, 'utf-8'));
    const lock = { name: fluxJson.name, version: fluxJson.version, libs: {} };

    for (const [libName, libInfo] of Object.entries(fluxJson.libs)) {
        const repoUrl = libInfo.repo;
        const ref = libInfo.ref || 'main';

        const localPath = join(projectRoot, LIBS_FOLDER, ...libName.split('/'));
        const alreadyCloned = await fs.stat(localPath).then(() => true).catch(() => false);

        if (!alreadyCloned) {
            console.log(`📦 Cloning ${libName}...`);
            runGit(['clone', repoUrl, localPath]);
        } else {
            console.log(`🔄 Updating ${libName}...`);
            runGit(['fetch'], localPath);
        }

        runGit(['checkout', ref], localPath);
        const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: localPath, encoding: 'utf-8' });
        const commitHash = result.stdout.trim();

        lock.libs[libName] = {
            repo: repoUrl,
            ref,
            commit: commitHash,
            path: localPath.replace(projectRoot + '/', '')
        };
    }

    await fs.writeFile(lockPath, JSON.stringify(lock, null, 2));
    console.log(`✅ flux-lock.json updated.`);
}
