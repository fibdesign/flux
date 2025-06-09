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

function gitTagExists(tag, cwd) {
    const result = spawnSync('git', ['tag', '-l', tag], { encoding: 'utf-8', cwd });
    if (result.status !== 0) {
        throw new Error(`Git command failed: git tag -l ${tag}`);
    }
    // If tag is listed, output contains the tag name, else empty
    return result.stdout.trim() === tag;
}

export async function downloadCommand() {
    const projectRoot = process.cwd();
    const fluxJsonPath = join(projectRoot, 'flux.json');
    const lockPath = join(projectRoot, 'flux-lock.json');

    const fluxJson = JSON.parse(await fs.readFile(fluxJsonPath, 'utf-8'));
    const lock = { name: fluxJson.name, version: fluxJson.version, libs: {} };

    for (const [libName, libInfo] of Object.entries(fluxJson.libs)) {
        const repoUrl = libInfo.repo;
        const ref = libInfo.ref; // Must be release tag

        if (!ref) {
            throw new Error(`Missing 'ref' (release tag) for ${libName} in flux.json`);
        }

        const localPath = join(projectRoot, LIBS_FOLDER, ...libName.split('/'));
        const alreadyCloned = await fs.stat(localPath).then(() => true).catch(() => false);

        if (!alreadyCloned) {
            console.log(`📦 Cloning ${libName} repo...`);
            runGit(['clone', '--no-checkout', repoUrl, localPath]);
        } else {
            console.log(`🔄 Fetching tags for ${libName}...`);
            runGit(['fetch', '--tags'], localPath);
        }

        // Check if the release tag exists locally, else fetch tags from origin
        if (!gitTagExists(ref, localPath)) {
            console.log(`Fetching tags from remote for ${libName}...`);
            runGit(['fetch', '--tags'], localPath);
            if (!gitTagExists(ref, localPath)) {
                const allTags = spawnSync('git', ['tag'], { encoding: 'utf-8', cwd: localPath });
                throw new Error(`Release tag '${ref}' not found in repo ${repoUrl} for ${libName} Available tags: \n ${allTags.stdout}`);
            }
        }

        // Checkout the release tag (detached HEAD)
        runGit(['checkout', ref], localPath);

        // Get commit hash for lock file
        const commitResult = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: localPath, encoding: 'utf-8' });
        const commitHash = commitResult.stdout.trim();

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
