"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
const tokenizer_1 = require("./tokenizer");
const parser_1 = require("./parser");
const fs_1 = __importDefault(require("fs"));
const FluxErrorHandler_1 = require("../utils/FluxErrorHandler");
const interpreter_1 = require("./interpreter");
const projectRoot = process.env.FLUX_PROJECT_ROOT || node_path_1.default.resolve('.');
const coreDir = __dirname;
const interpreter = new interpreter_1.Interpreter();
const preLoadFluxModules = () => {
    //
};
const runApp = () => {
    const FILE_PATH = 'boot.flux';
    if (!fs_1.default.existsSync(FILE_PATH)) {
        FluxErrorHandler_1.FluxErrorHandler.error('No boot.flux found.');
    }
    const filePath = node_path_1.default.resolve(projectRoot, FILE_PATH);
    const code = (0, node_fs_1.readFileSync)(filePath, 'utf-8');
    const tokens = (0, tokenizer_1.tokenize)(code);
    const parser = new parser_1.Parser(tokens);
    const AST = parser.parse();
    interpreter.run(AST);
};
preLoadFluxModules();
runApp();
interpreter.serve();
//# sourceMappingURL=flux.js.map