import { promises as fs } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';
import { logSuccess, logInfo, logWarning, logError } from '../utils/logger.js';

function runGit(args, cwd) {
    const result = spawnSync('git', args, { cwd, encoding: 'utf-8' });
    if (result.status !== 0) {
        throw new Error(`Git command failed: git ${args.join(' ')}\n${result.stderr}`);
    }
    return result.stdout.trim();
}

function gitTagExists(tag, cwd) {
    const result = spawnSync('git', ['tag', '-l', tag], { encoding: 'utf-8', cwd });
    if (result.status !== 0) {
        throw new Error(`Git command failed: git tag -l ${tag}`);
    }
    return result.stdout.trim() === tag;
}

export async function downloadCommand() {
    try {
        const projectRoot = process.cwd();
        const fluxJsonPath = join(projectRoot, 'flux.json');
        const lockPath = join(projectRoot, 'flux-lock.json');

        const fluxJson = JSON.parse(await fs.readFile(fluxJsonPath, 'utf-8'));
        const lock = { name: fluxJson.name, version: fluxJson.version, libs: {} };

        for (const [libName, libInfo] of Object.entries(fluxJson.libs)) {
            const repoUrl = libInfo.repo;
            const ref = libInfo.ref;

            if (!ref) {
                logError(`Missing 'ref' (release tag) for ${libName} in flux.json`);
                throw new Error(`Missing 'ref' (release tag) for ${libName} in flux.json`);
            }

            const localPath = join(projectRoot, 'libs', ...libName.split('/'));
            const alreadyCloned = await fs.stat(localPath).then(() => true).catch(() => false);

            if (!alreadyCloned) {
                console.log(`📦 ${libName}`);
                console.log(`  └─ Cloning repo...`);
                runGit(['clone', '--no-checkout', repoUrl, localPath]);
            } else {
                console.log(`📦 ${libName}`);
                console.log(`  └─ Fetching tags...`);
                runGit(['fetch', '--tags'], localPath);
            }

            if (!gitTagExists(ref, localPath)) {
                logWarning(`Release tag '${ref}' not found locally for ${libName}, fetching tags from remote...`);
                runGit(['fetch', '--tags'], localPath);
                if (!gitTagExists(ref, localPath)) {
                    const allTags = spawnSync('git', ['tag'], { encoding: 'utf-8', cwd: localPath });
                    const tags = allTags.stdout
                        .trim()
                        .split('\n')
                        .map(tag => `  ├─ ${tag}`)
                        .join('\n');

                    throw new Error(`Release tag '${ref}' not found in repo ${repoUrl} for ${libName}\nAvailable tags:\n${tags}`);

                    throw new Error(`Release tag '${ref}' not found in repo ${repoUrl} for ${libName}`);
                }
            }

            runGit(['checkout', '--quiet', ref], localPath);

            const commitResult = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: localPath, encoding: 'utf-8' });
            const commitHash = commitResult.stdout.trim();

            lock.libs[libName] = {
                repo: repoUrl,
                ref,
                commit: commitHash,
                path: localPath.replace(projectRoot + '/', '')
            };

            logSuccess(`  └─ ${libName}@${ref} downloaded. \n`);
        }

        await fs.writeFile(lockPath, JSON.stringify(lock, null, 2));
        logSuccess('' );
        logSuccess('flux-lock.json updated successfully.', true);
    } catch (err) {
        logError(err.message);
        process.exit(1);
    }
}
