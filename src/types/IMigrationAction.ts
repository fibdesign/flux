import {IMigrationColumn} from "./IMigrationColumn";

export interface IMigrationAction {
    action: string,
    table: string,
    fields?: IMigrationColumn[],
    column?: IMigrationColumn
}