import fs from 'fs';
import path from 'path';
import {FluxErrorHandler} from "../utils/FluxErrorHandler";
import {readFileSync} from "node:fs";
import {tokenize} from "../core/tokenizer";
import {Parser} from "../core/parser";
import {Interpreter} from "../core/interpreter";

function discoverFluxFiles(baseDir: string, subFolder: string): string[] {
    const result: string[] = [];

    function walk(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath); // recurse
            } else if (entry.isFile() && entry.name.endsWith('.flux')) {
                result.push(fullPath);
            }
        }
    }

    // Iterate over modules
    const modules = fs.readdirSync(baseDir, { withFileTypes: true });
    for (const moduleEntry of modules) {
        if (!moduleEntry.isDirectory()) continue;

        const targetFolder = path.join(baseDir, moduleEntry.name, subFolder);
        if (fs.existsSync(targetFolder) && fs.statSync(targetFolder).isDirectory()) {
            walk(targetFolder);
        }
    }

    // Optional: sort alphabetically (or by timestamp prefix)
    result.sort();
    return result;
}

// TODO: options: -f (fresh: drop all tables)
export const migrateCommand = async (options?: string[]) => {

    const projectRoot = path.resolve('.');

    const migrationFiles = discoverFluxFiles(path.join(projectRoot, 'src/modules'), 'migrations');

    const interpreter = new Interpreter()

    if (options?.includes('-f')) {
        await interpreter.dropAllTables();
    }

    for (const migrationPath of migrationFiles) {
        const code = readFileSync(migrationPath, 'utf-8');
        const tokens = tokenize(code);
        const parser = new Parser(tokens)
        const AST = parser.parse()
        interpreter.run(AST)
    }

    await interpreter.runDBMigrations()

}