import {IMigrationAction} from "./IMigrationAction";

export interface IMigration {
    name: string,
    dependencies: string[],
    up: IMigrationAction[],
    down: IMigrationAction[]
}