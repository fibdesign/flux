import {spawn} from "child_process";
import {resolve} from "path";
import {ChildProcess} from "child_process";
import watch from "node-watch";
import {COLORS} from "../constants/COLORS";
import {HelpCommandDisplay} from "../utils/HelpCommandDisplay";
import {serveCommandHelp} from "./helps/serve.command.help";

const showRestartMessage = (name: string) => {
    const date = new Date().toLocaleTimeString(undefined,{hour12: false})
    const fileName = name.split(/[\\/]/).pop();
    const dateLog = `${COLORS.Cyan}[${date}]${COLORS.Reset}`
    const changesCountLog = `${COLORS.Yellow}+1${COLORS.Reset}`
    const messageLog = `${COLORS.Green}files changed, restarting server...${COLORS.Reset}`
    console.log(`${dateLog} ${changesCountLog} ${messageLog}  ➜  ${fileName}`);
}

const FLUX_JS_PATH = '../core/flux.js'

let restartTimeout: NodeJS.Timeout | null = null;

export const serveCommand = (options: string[]): void => {

    const helpOptions = ['-h', '--help'];
    const help = options.some(opt => helpOptions.includes(opt));

    if (help) {
        HelpCommandDisplay(serveCommandHelp);
        return;
    }

    const targetDirectory = process.cwd();

    const serverScript = resolve(__dirname, FLUX_JS_PATH);
    let childProcess: ChildProcess|null = null;

    const startServer = () => {
        if (childProcess) childProcess.kill();
        childProcess = spawn('node', [serverScript, 'serve'], { stdio: 'inherit' });
    }

    startServer();

    const noWatch = options.includes('--no-watch');

    if (noWatch) {
        console.log(`${COLORS.Yellow}File watching is disabled (--no-watch option used).${COLORS.Reset}`);
        return;
    }

    process.env.__FLUX_BROWSER_OPENED__ = String(true);

    const filterPattern = /\.flux$/;
    const watchOptions = { recursive: true, filter: filterPattern }

    watch(targetDirectory,watchOptions , (_,name) => {
        if (restartTimeout) clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => {
            showRestartMessage(name);
            startServer();
        }, 200);
    })
}