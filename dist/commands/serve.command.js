"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
const child_process_1 = require("child_process");
const path_1 = require("path");
const node_watch_1 = __importDefault(require("node-watch"));
const COLORS_1 = require("../constants/COLORS");
const HelpCommandDisplay_1 = require("../utils/HelpCommandDisplay");
const serve_command_help_1 = require("./helps/serve.command.help");
const showRestartMessage = (name) => {
    const date = new Date().toLocaleTimeString(undefined, { hour12: false });
    const fileName = name.split(/[\\/]/).pop();
    const dateLog = `${COLORS_1.COLORS.Cyan}[${date}]${COLORS_1.COLORS.Reset}`;
    const changesCountLog = `${COLORS_1.COLORS.Yellow}+1${COLORS_1.COLORS.Reset}`;
    const messageLog = `${COLORS_1.COLORS.Green}files changed, restarting server...${COLORS_1.COLORS.Reset}`;
    console.log(`${dateLog} ${changesCountLog} ${messageLog}  ➜  ${fileName}`);
};
const FLUX_JS_PATH = '../core/flux.js';
let restartTimeout = null;
const serveCommand = (options) => {
    const helpOptions = ['-h', '--help'];
    const help = options.some(opt => helpOptions.includes(opt));
    if (help) {
        (0, HelpCommandDisplay_1.HelpCommandDisplay)(serve_command_help_1.serveCommandHelp);
        return;
    }
    const targetDirectory = process.cwd();
    const serverScript = (0, path_1.resolve)(__dirname, FLUX_JS_PATH);
    let childProcess = null;
    const startServer = () => {
        if (childProcess)
            childProcess.kill();
        childProcess = (0, child_process_1.spawn)('node', [serverScript, 'serve'], { stdio: 'inherit' });
    };
    startServer();
    const noWatch = options.includes('--no-watch');
    if (noWatch) {
        console.log(`${COLORS_1.COLORS.Yellow}File watching is disabled (--no-watch option used).${COLORS_1.COLORS.Reset}`);
        return;
    }
    process.env.__FLUX_BROWSER_OPENED__ = String(true);
    const filterPattern = /\.flux$/;
    const watchOptions = { recursive: true, filter: filterPattern };
    (0, node_watch_1.default)(targetDirectory, watchOptions, (_, name) => {
        if (restartTimeout)
            clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => {
            showRestartMessage(name);
            startServer();
        }, 200);
    });
};
exports.serveCommand = serveCommand;
//# sourceMappingURL=serve.command.js.map