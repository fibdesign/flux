// compiler/flux.js

const { readFileSync } = require('node:fs');
const path = require('node:path');

const { tokenize } = require('./tokenizer');
const { Parser } = require('./parser');
const { Interpreter } = require('./interpreter');


const projectRoot = process.env.FLUX_PROJECT_ROOT || path.resolve('.');

const codePath = path.resolve(projectRoot, 'boot.flux');
const code = readFileSync(codePath, 'utf-8');

const tokens = tokenize(code);
const parser = new Parser(tokens);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
interpreter.run();
