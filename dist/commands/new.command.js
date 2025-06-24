"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newCommand = void 0;
const readline = __importStar(require("readline"));
const COLORS_1 = require("../constants/COLORS");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const EXIT_CODES_1 = require("../constants/EXIT_CODES");
const HelpCommandDisplay_1 = require("../utils/HelpCommandDisplay");
const new_command_help_1 = require("./helps/new.command.help");
const askProjectName = async () => {
    const defaultName = 'my-flux-app';
    return new Promise(resolve => {
        const input = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        input.question(`${COLORS_1.COLORS.Cyan} ➜  Please enter your project name${COLORS_1.COLORS.Dim} (default: ${defaultName}): ${COLORS_1.COLORS.Reset}`, (value) => {
            input.close();
            resolve(value.trim() || defaultName);
        });
    });
};
const copyStubs = (destination) => {
    const STUBS_PATH = '../../stubs';
    let stubsSource = process.pkg
        ? path_1.default.join(__dirname, STUBS_PATH)
        : path_1.default.resolve(__dirname, STUBS_PATH);
    copyDirRecursive(stubsSource, destination);
};
const copyDirRecursive = (stubsSource, destination) => {
    if (!fs.existsSync(destination))
        fs.mkdirSync(destination, { recursive: true });
    const entries = fs.readdirSync(stubsSource, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path_1.default.join(stubsSource, entry.name);
        const destPath = path_1.default.join(destination, entry.name);
        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        }
        else if (entry.isFile()) {
            const content = fs.readFileSync(srcPath);
            fs.writeFileSync(destPath, content);
        }
    }
};
const showSuccessMessage = (projectName, projectPath) => {
    const line = `${COLORS_1.COLORS.Dim}────────────────────────────────────────────${COLORS_1.COLORS.Reset}`;
    console.log(``);
    console.log(`${COLORS_1.COLORS.Green}🎉  New Flux Project Created Successfully!${COLORS_1.COLORS.Reset}`);
    console.log(line);
    console.log(`  ➜  ${COLORS_1.COLORS.Bright}Project Name:${COLORS_1.COLORS.Reset}   ${COLORS_1.COLORS.Magenta}${projectName}${COLORS_1.COLORS.Reset}`);
    console.log(`  ➜  ${COLORS_1.COLORS.Bright}Location:${COLORS_1.COLORS.Reset}       ${COLORS_1.COLORS.Cyan}${projectPath}${COLORS_1.COLORS.Reset}`);
    console.log(`  ➜  ${COLORS_1.COLORS.Bright}Next Steps:${COLORS_1.COLORS.Reset}`);
    console.log(`          ➜  ${COLORS_1.COLORS.Yellow}cd ${projectName}${COLORS_1.COLORS.Reset}`);
    console.log(`          ➜  ${COLORS_1.COLORS.Yellow}flux download${COLORS_1.COLORS.Reset}`);
    console.log(`          ➜  ${COLORS_1.COLORS.Yellow}flux serve${COLORS_1.COLORS.Reset}`);
    console.log(line);
    console.log(`  ➜  ${COLORS_1.COLORS.Bright}Learn more at:${COLORS_1.COLORS.Reset}  ${COLORS_1.COLORS.Cyan}https://docs.flux.fibdesign.ir${COLORS_1.COLORS.Reset}`);
    console.log(line);
    console.log(`${COLORS_1.COLORS.Dim}Happy coding!${COLORS_1.COLORS.Reset}\n`);
};
const newCommand = async (options) => {
    let projectName = options?.[0];
    if (projectName?.includes('-h')) {
        (0, HelpCommandDisplay_1.HelpCommandDisplay)(new_command_help_1.newCommandHelp);
        return;
    }
    if (!projectName) {
        projectName = await askProjectName();
    }
    const projectPath = path_1.default.resolve(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
        console.error(`${COLORS_1.COLORS.Yellow}Error: Directory "${projectName}" already exists.${COLORS_1.COLORS.Reset}`);
        process.exit(EXIT_CODES_1.EXIT_CODES.IO_ERROR);
    }
    try {
        fs.mkdirSync(projectPath, { recursive: true });
        copyStubs(projectPath);
        showSuccessMessage(projectName, projectPath);
    }
    catch (error) {
        console.error('Failed to create project:', error.message);
        process.exit(EXIT_CODES_1.EXIT_CODES.GENERAL_ERROR);
    }
};
exports.newCommand = newCommand;
//# sourceMappingURL=new.command.js.map