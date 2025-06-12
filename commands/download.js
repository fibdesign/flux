const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const Reset = '\x1b[0m';
const Dim = '\x1b[2m';
const Bright = '\x1b[1m';
const Cyan = '\x1b[36m';
const Magenta = '\x1b[35m';
const Yellow = '\x1b[33m';
const Green = '\x1b[32m';
const Blue = '\x1b[34m';

function getRemoteTags(repo) {
    // Run `git ls-remote --tags` to get all tags from the remote repo
    const result = spawnSync('git', ['ls-remote', '--tags', repo], { encoding: 'utf-8' });
    if (result.status !== 0) return null;

    // Parse tag names from output lines, ignore annotated tags (those ending with ^{})
    const tags = result.stdout
        .split('\n')
        .map(line => line.trim().split('\t')[1])
        .filter(ref => ref && ref.startsWith('refs/tags/'))
        .map(ref => ref.replace('refs/tags/', '').replace(/\^\{\}$/, ''))
        .filter(Boolean);

    return tags;
}

function getFolderNameFromRepo(repoUrl) {
    try {
        const url = new URL(repoUrl);
        // url.pathname is like "/user/repo" or "/user/repo.git"
        // Remove leading slash and possible trailing ".git"
        return url.pathname.replace(/^\/|\.git$/g, '');
    } catch {
        // If repoUrl is invalid, return null
        return null;
    }
}

module.exports = function downloadCommand(args) {
    const cwd = process.cwd();
    const fluxJsonPath = path.join(cwd, 'flux.json');

    if (!fs.existsSync(fluxJsonPath)) {
        console.error(`${Yellow}Error: flux.json not found in the current directory.${Reset}`);
        process.exit(1);
    }

    let fluxConfig;
    try {
        fluxConfig = JSON.parse(fs.readFileSync(fluxJsonPath, 'utf-8'));
    } catch (err) {
        console.error(`${Yellow}Error: Failed to parse flux.json -${Reset} ${err.message}`);
        process.exit(1);
    }

    const libs = fluxConfig.libs || {};

    if (Object.keys(libs).length === 0) {
        console.log(`${Dim}No libraries defined in flux.json.${Reset}`);
        return;
    }

    const libsDir = path.join(cwd, 'libs');
    if (!fs.existsSync(libsDir)) {
        fs.mkdirSync(libsDir);
    }

    for (const [libName, { repo, tag }] of Object.entries(libs)) {
        console.log('');
        if (!repo || !tag) {
            console.warn(`  ➜  ${Yellow}Warning: Skipping '${libName}' - missing repository URL or tag.${Reset}`);
            continue;
        }

        const folderName = getFolderNameFromRepo(repo);
        if (!folderName) {
            console.warn(`  ➜  ${Yellow}Warning: Could not parse repo URL for '${libName}', skipping.${Reset}`);
            continue;
        }

        const libPath = path.join(libsDir, folderName);

        if (fs.existsSync(libPath)) {
            console.log(`  ➜  ${Cyan}Library '${folderName}' already exists, skipping download.${Reset}`);
            continue;
        }

        console.log(`  ➜  ${Bright}Downloading '${folderName}' at tag '${tag}'...${Reset}`);

        const result = spawnSync('git', ['clone', '--branch', tag, '--depth', '1', repo, libPath], {
            stdio: 'ignore'
        });

        if (result.status === 0) {
            console.log(`  └── ${Green}Downloading successful.${Reset}`);
        } else {
            console.log(`  └── ${Magenta}Downloading failed.${Reset}`);

            // Suggest existing tags
            const availableTags = getRemoteTags(repo);
            if (availableTags && availableTags.length) {
                const maxTagsToShow = 10;
                const tagsToShow = availableTags.slice(0, maxTagsToShow);
                tagsToShow.forEach((tag, index) => {
                    const isLast = index === tagsToShow.length - 1;
                    const branchChar = isLast ? '└' : '├';
                    console.log(`       ${branchChar}──  ${Bright}${tag}${Reset}`);
                });
                if (availableTags.length > 10) {
                    console.log(`       └──  ${Dim}...and ${availableTags.length - 10} more.${Reset}`);
                }
            } else {
                console.log(`       └──  ${Dim}Could not retrieve tags from the repository.${Reset}`);
            }
        }
    }
};
