const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

module.exports = function downloadCommand(args) {
    const cwd = process.cwd();
    const fluxJsonPath = path.join(cwd, 'flux.json');

    if (!fs.existsSync(fluxJsonPath)) {
        console.error('Error: flux.json not found in current directory.');
        process.exit(1);
    }

    let fluxConfig;
    try {
        fluxConfig = JSON.parse(fs.readFileSync(fluxJsonPath, 'utf-8'));
    } catch (err) {
        console.error('Error parsing flux.json:', err.message);
        process.exit(1);
    }

    const libs = fluxConfig.libs || {};

    if (Object.keys(libs).length === 0) {
        console.log('No libs defined in flux.json.');
        return;
    }

    const libsDir = path.join(cwd, 'libs');
    if (!fs.existsSync(libsDir)) {
        fs.mkdirSync(libsDir);
    }

    for (const [libName, { repo, tag }] of Object.entries(libs)) {
        if (!repo || !tag) {
            console.warn(`Skipping ${libName}: missing repo or tag`);
            continue;
        }

        const libPath = path.join(libsDir, libName);

        if (fs.existsSync(libPath)) {
            console.log(`${libName} already exists, skipping...`);
            continue;
        }

        console.log(`Cloning ${libName}...`);

        // git clone --branch <tag> --depth 1 <repo> <libPath>
        const result = spawnSync('git', ['clone', '--branch', tag, '--depth', '1', repo, libPath], { stdio: 'inherit' });

        if (result.status === 0) {
            console.log(`${libName}@${tag} successfully downloaded`);
        } else {
            console.error(`${libName}@${tag} failed to download`);
        }
    }
};
