export type TDBWhereCondition =
    | { type: 'basic', column: string, operator: string, value: any, boolean: 'and' | 'or' }
    | { type: 'in', column: string, values: any[], boolean: 'and' | 'or' }
    | { type: 'null', column: string, boolean: 'and' | 'or' };

export interface IDBOrder { column: string, direction: 'ASC' | 'DESC' }


export interface IDBDriver {
    connect(): Promise<void>;
    close(): Promise<void>;
    execute(sql: string, bindings: any[]): Promise<any>;
}

export interface IDBDriverOptions {
    host: string,
    user: string,
    password: string,
    database: string,
}

export type TDBQueryOperation = 'select' | 'count' | 'exists' | 'insert' | 'update' | 'delete';

export interface TDBCompilerInput {
    table: string;
    wheres: TDBWhereCondition[];
    orders: IDBOrder[];
    limit?: number;
    offset?: number;
    data?: Record<string, any> | Record<string, any>[];
    operation: TDBQueryOperation;
    fields: string[];
}