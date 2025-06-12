const fs = require('fs');
const path = require('path');
const readline = require('readline');

const Reset = '\x1b[0m';
const Dim = '\x1b[2m';
const Bright = '\x1b[1m';
const Cyan = '\x1b[36m';
const Magenta = '\x1b[35m';
const Green = '\x1b[32m';
const Yellow = '\x1b[33m';

function askProjectName() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const defaultName = 'my-flux-app';

        rl.question(`${Cyan} ➜  Please enter your project name${Dim} (default: ${defaultName}): ${Reset}`, (answer) => {
            rl.close();
            const projectName = answer.trim() || defaultName;
            resolve(projectName);
        });
    });
}

module.exports = async function newCommand(args) {
    let projectName = args[0];

    if (!projectName) {
        projectName = await askProjectName();
    }

    const projectPath = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
        console.error(`${Yellow}Error: Directory "${projectName}" already exists.${Reset}`);
        process.exit(1);
    }

    try {
        fs.mkdirSync(projectPath, { recursive: true });

        copyStubs(projectPath);

        printSuccess(projectName, projectPath);
    } catch (err) {
        console.error('Failed to create project:', err.message);
        process.exit(1);
    }
};

function copyStubs(dest) {
    let stubsSource;

    if (process.pkg) {
        stubsSource = path.join(__dirname, '../stubs');
    } else {
        stubsSource = path.resolve(__dirname, '../stubs');
    }

    copyDirRecursive(stubsSource, dest);
}

function copyDirRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else if (entry.isFile()) {
            const content = fs.readFileSync(srcPath);
            fs.writeFileSync(destPath, content);
        }
    }
}

function printSuccess(projectName, projectPath) {
    const line = `${Dim}────────────────────────────────────────────${Reset}`;

    console.log(``);
    console.log(`${Green}🎉  New Flux Project Created Successfully!${Reset}`);
    console.log(line);
    console.log(`  ➜  ${Bright}Project Name:${Reset}   ${Magenta}${projectName}${Reset}`);
    console.log(`  ➜  ${Bright}Location:${Reset}       ${Cyan}${projectPath}${Reset}`);
    console.log(`  ➜  ${Bright}Next Steps:${Reset}`);
    console.log(`          ➜  ${Yellow}cd ${projectName}${Reset}`);
    console.log(`          ➜  ${Yellow}flux download${Reset}`);
    console.log(`          ➜  ${Yellow}flux serve${Reset}`);
    console.log(line);
    console.log(`  ➜  ${Bright}Learn more at:${Reset}  ${Cyan}https://docs.flux.fibdesign.ir${Reset}`);
    console.log(line);
    console.log(`${Dim}Happy coding!${Reset}\n`);
}
