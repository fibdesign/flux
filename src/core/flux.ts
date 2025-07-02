import path from "node:path";
import {readFileSync} from "node:fs";
import {tokenize} from "./tokenizer";
import {Parser} from "./parser";
import fs from "fs";
import {FluxErrorHandler} from "../utils/FluxErrorHandler";
import {Interpreter} from "./interpreter";

const projectRoot = process.env.FLUX_PROJECT_ROOT || path.resolve('.');
const coreDir = __dirname;

const interpreter = new Interpreter()

const preLoadFluxModules = () => {
    //
}

const runApp = () => {
    const FILE_PATH = 'src/boot.flux';
    if (!fs.existsSync(FILE_PATH)) {
        FluxErrorHandler.error('No boot.flux found.')
    }
    const filePath = path.resolve(projectRoot, FILE_PATH);
    const code = readFileSync(filePath, 'utf-8');
    const tokens = tokenize(code);
    const parser = new Parser(tokens)
    const AST = parser.parse()
    interpreter.run(AST)
}

preLoadFluxModules()
runApp()


interpreter.serve()
