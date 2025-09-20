import {FluxErrorHandler} from "./FluxErrorHandler";

export const mapTypesToMigration = (type: string) => {
    switch(type) {
        case 'uuid': return 'CHAR(36)';
        case 'string': return 'VARCHAR(255)';
        case 'int': return 'INT';
        case 'bool': return 'TINYINT(1)';
        case 'datetime': return 'DATETIME';
        default: FluxErrorHandler.runtime(`Unknown migration type: ${type}`);
    }
}