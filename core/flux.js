// compiler/flux.js

import { readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.env.FLUX_PROJECT_ROOT || path.resolve('.');

const codePath = path.resolve(projectRoot, 'boot.flux');
const code = readFileSync(codePath, 'utf-8');

import { tokenize } from './tokenizer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';

const tokens = tokenize(code);
const parser = new Parser(tokens);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
interpreter.run();
