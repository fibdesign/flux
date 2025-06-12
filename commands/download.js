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
        console.log(``);
        if (!repo || !tag) {
            console.warn(`  ➜  ${Yellow}Warning: Skipping '${libName}' - missing repository URL or tag.${Reset}`);
            continue;
        }

        const libPath = path.join(libsDir, libName);

        if (fs.existsSync(libPath)) {
            console.log(`  ➜  ${Cyan}Library '${libName}' already exists, skipping download.${Reset}`);
            continue;
        }

        console.log(`  ➜  ${Bright}Downloading '${libName}' at tag '${tag}'...${Reset}`);

        // Disable git output: use stdio 'ignore'
        const result = spawnSync('git', ['clone', '--branch', tag, '--depth', '1', repo, libPath], {
            stdio: 'ignore'
        });

        if (result.status === 0) {
            console.log(`  └── ${Green}Downloading successful.${Reset}`);
        } else {
            console.log(`  └── ${Magenta}Downloading failed.${Reset}`);
        }
    }
};
