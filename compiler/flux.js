// flux.js

import { readFileSync } from 'node:fs';
import { tokenize } from './tokenizer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';

const code = readFileSync('index.flux', 'utf-8');

const tokens = tokenize(code);
const parser = new Parser(tokens);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
interpreter.run();

console.log('✅  Execution finished.');
// console.log(JSON.stringify(interpreter.environment, null, 2));
