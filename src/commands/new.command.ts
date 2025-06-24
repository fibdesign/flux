import * as readline from "readline";
import {COLORS} from "../constants/COLORS";
import path from "path";
import * as fs from "fs";
import {EXIT_CODES} from "../constants/EXIT_CODES";
import {HelpCommandDisplay} from "../utils/HelpCommandDisplay";
import {newCommandHelp} from "./helps/new.command.help";

const askProjectName = async (): Promise<string> => {
    const defaultName = 'my-flux-app';
    return new Promise(resolve => {
        const input = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })

        input.question(`${COLORS.Cyan} ➜  Please enter your project name${COLORS.Dim} (default: ${defaultName}): ${COLORS.Reset}`, (value) => {
            input.close();
            resolve(value.trim() || defaultName);
        })
    })
}
const copyStubs = (destination: string) => {
    const STUBS_PATH = '../../stubs';

    let stubsSource = process.pkg
        ? path.join(__dirname, STUBS_PATH)
        : path.resolve(__dirname, STUBS_PATH)

    copyDirRecursive(stubsSource, destination);
}
const copyDirRecursive = (stubsSource:string, destination: string) => {
    if (!fs.existsSync(destination)) fs.mkdirSync(destination, { recursive: true });

    const entries = fs.readdirSync(stubsSource, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(stubsSource, entry.name);
        const destPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else if (entry.isFile()) {
            const content = fs.readFileSync(srcPath);
            fs.writeFileSync(destPath, content);
        }
    }
}
const showSuccessMessage = (projectName:string, projectPath:string) => {
    const line = `${COLORS.Dim}────────────────────────────────────────────${COLORS.Reset}`;

    console.log(``);
    console.log(`${COLORS.Green}🎉  New Flux Project Created Successfully!${COLORS.Reset}`);
    console.log(line);
    console.log(`  ➜  ${COLORS.Bright}Project Name:${COLORS.Reset}   ${COLORS.Magenta}${projectName}${COLORS.Reset}`);
    console.log(`  ➜  ${COLORS.Bright}Location:${COLORS.Reset}       ${COLORS.Cyan}${projectPath}${COLORS.Reset}`);
    console.log(`  ➜  ${COLORS.Bright}Next Steps:${COLORS.Reset}`);
    console.log(`          ➜  ${COLORS.Yellow}cd ${projectName}${COLORS.Reset}`);
    console.log(`          ➜  ${COLORS.Yellow}flux download${COLORS.Reset}`);
    console.log(`          ➜  ${COLORS.Yellow}flux serve${COLORS.Reset}`);
    console.log(line);
    console.log(`  ➜  ${COLORS.Bright}Learn more at:${COLORS.Reset}  ${COLORS.Cyan}https://docs.flux.fibdesign.ir${COLORS.Reset}`);
    console.log(line);
    console.log(`${COLORS.Dim}Happy coding!${COLORS.Reset}\n`);
}
export const newCommand = async (options?: string[]) => {
    let projectName: string | undefined = options?.[0];
    if (projectName?.includes('-h')){
        HelpCommandDisplay(newCommandHelp);
        return;
    }
    if (!projectName) {
        projectName = await askProjectName();
    }

    const projectPath = path.resolve(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
        console.error(`${COLORS.Yellow}Error: Directory "${projectName}" already exists.${COLORS.Reset}`);
        process.exit(EXIT_CODES.IO_ERROR);
    }

    try {
        fs.mkdirSync(projectPath, {recursive: true});
        copyStubs(projectPath)
        showSuccessMessage(projectName, projectPath);
    } catch (error: any) {
        console.error('Failed to create project:', error.message);
        process.exit(EXIT_CODES.GENERAL_ERROR)
    }
}