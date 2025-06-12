const fs = require('fs');
const path = require('path');

module.exports = function newCommand(args) {
    const projectName = args[0];
    if (!projectName) {
        console.error('Error: Please specify a project name.');
        process.exit(1);
    }

    const projectPath = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
        console.error(`Error: Directory "${projectName}" already exists.`);
        process.exit(1);
    }

    try {
        fs.mkdirSync(projectPath, { recursive: true });

        copyStubs(projectPath);

        console.log(`New Flux project created at ${projectPath} by copying stubs.`);
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
