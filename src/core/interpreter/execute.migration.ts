import {Interpreter} from "./index";
import {IMigrationNode} from "../../types/TFluxAST";
import {IMigration} from "../../types/IMigration";

export const executeMigration = (interpreter: Interpreter, node: IMigrationNode): void => {

    const migration: IMigration = {
        name: node.name,
        dependencies: node.dependencies,
        up: node.up,
        down: node.down,
    }
    interpreter.Migrations.push(migration);
}