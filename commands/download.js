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
    const result = spawnSync('git', ['ls-remote', '--tags', repo], { encoding: 'utf-8' });
    if (result.status !== 0) return null;

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
        return url.pathname.replace(/^\/|\.git$/g, '');
    } catch {
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
    console.log(`${Bright}${Blue}Starting to download libraries defined in flux.json...${Reset}`);

    const libsDir = path.join(cwd, 'libs');
    if (!fs.existsSync(libsDir)) {
        fs.mkdirSync(libsDir);
    }

    let successCount = 0;
    let failCount = 0;

    for (const [libName, { repo, tag }] of Object.entries(libs)) {
        console.log('');
        if (!repo || !tag) {
            console.warn(`  ➜  ${Yellow}Warning: Skipping '${libName}' - missing repository URL or tag.${Reset}`);
            failCount++;
            continue;
        }

        const folderName = getFolderNameFromRepo(repo);
        if (!folderName) {
            console.warn(`  ➜  ${Yellow}Warning: Could not parse repo URL for '${libName}', skipping.${Reset}`);
            failCount++;
            continue;
        }

        const libPath = path.join(libsDir, folderName);

        if (fs.existsSync(libPath)) {
            console.log(`  ➜  ${Cyan}Library '${folderName}' already exists, skipping download.${Reset}`);
            continue;
        }

        console.log(`  📦  ${Bright}Downloading '${folderName}' at tag '${tag}'...${Reset}`);

        const result = spawnSync('git', ['clone', '--branch', tag, '--depth', '1', repo, libPath], {
            stdio: 'ignore'
        });

        if (result.status === 0) {
            console.log(`  └── ${Green}Downloading successful.${Reset}`);
            successCount++;
        } else {
            console.log(`  └── ${Magenta}Downloading failed.${Reset}`);

            const availableTags = getRemoteTags(repo);
            if (availableTags && availableTags.length) {
                const maxTagsToShow = 10;
                const tagsToShow = availableTags.slice(0, maxTagsToShow);
                console.log(`  └── ${Dim}Available tags are:${Reset}`);
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
            failCount++;
        }
    }

    // Summary
    console.log('');
    console.log(`${Bright}Download Summary:${Reset}`);

    if (successCount > 0) {
        console.log(`  ${Green}✅ Successfully downloaded ${successCount} ${successCount === 1 ? 'library' : 'libraries'}.${Reset}`);
    } else {
        console.log(`  ${Yellow}⚠️ No libraries were downloaded successfully.${Reset}`);
    }

    if (failCount > 0) {
        console.log(`  ${Magenta}❌ Failed to download ${failCount} ${failCount === 1 ? 'library' : 'libraries'}. Please check the warnings above for details.${Reset}`);
    } else {
        console.log(`  ${Green}🎉 No download failures! All libraries were downloaded without issues.${Reset}`);
    }

};
