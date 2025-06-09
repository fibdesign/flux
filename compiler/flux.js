// flux.js

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tokenize } from './tokenizer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const code = readFileSync(resolve(__dirname, '../index.flux'), 'utf-8');

const tokens = tokenize(code);
const parser = new Parser(tokens);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
interpreter.run();
