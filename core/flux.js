// core/flux.js

const { readFileSync } = require('node:fs');
const path = require('node:path');

const { tokenize } = require('./tokenizer');
const { Parser } = require('./parser');
const { Interpreter } = require('./interpreter');

const projectRoot = process.env.FLUX_PROJECT_ROOT || path.resolve('.');
const coreDir = __dirname;

// Create interpreter with module system
const interpreter = new Interpreter();
interpreter.moduleCache = new Map();

// Load std.flux
const stdPath = path.resolve(coreDir, '../libs/std.flux');
const stdCode = readFileSync(stdPath, 'utf-8');
const stdTokens = tokenize(stdCode);
const stdParser = new Parser(stdTokens);
const stdAst = stdParser.parse();
interpreter.runModule(stdAst, stdPath);

// Load boot.flux
const bootPath = path.resolve(projectRoot, 'boot.flux');
const bootCode = readFileSync(bootPath, 'utf-8');
const bootTokens = tokenize(bootCode);
const bootParser = new Parser(bootTokens);
const bootAst = bootParser.parse();
interpreter.runModule(bootAst, bootPath);

// Finalize interpreter
interpreter.finalize();