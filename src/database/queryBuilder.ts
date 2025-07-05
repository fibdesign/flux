import {IDBDriver, IDBOrder, TDBCompilerInput, TDBQueryOperation, TDBWhereCondition} from "../types/TDatabase";
import SQLCompiler from "./SQLCompiler";


export class QueryBuilder {
    private readonly table: string;
    private wheres: TDBWhereCondition[] = [];
    private orders: IDBOrder[] = [];
    private limitValue?: number;
    private offsetValue?: number;
    private data?: Record<string, any> | Record<string, any>[];
    private driver: IDBDriver;
    private selectFields: string[] = [];

    constructor(tableName: string, driver: IDBDriver) {
        this.table = tableName;
        this.driver = driver;
    }

    where(column: string, operator: string, value: any): this {
        this.wheres.push({type: 'basic', column, operator, value, boolean: 'and'});
        return this;
    }

    orWhere(column: string, operator: string, value: any): this {
        this.wheres.push({type: 'basic', column, operator, value, boolean: 'or'});
        return this;
    }

    whereIn(column: string, values: any[]): this {
        this.wheres.push({type: 'in', column, values, boolean: 'and'});
        return this;
    }

    whereNull(column: string): this {
        this.wheres.push({type: 'null', column, boolean: 'and'});
        return this;
    }

    orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
        this.orders.push({column, direction});
        return this;
    }

    limit(amount: number): this {
        this.limitValue = amount;
        return this;
    }

    offset(amount: number): this {
        this.offsetValue = amount;
        return this;
    }

    debug(): this {
        return this;
    }

    get() {
        return this.execute('select')
    }

    async first() {
        this.limit(1);
        const data = await this.get()
        return data.at(0)
    }

    async count(){
        const result = await this.execute('count')
        return Number(result.at(0).count)
    }

    fields(...args: any[]): this {
        this.selectFields = args;
        return this;
    }

    async paginate(perPage: number = 15, currentPage: number = 1) {

        const safePerPage = Math.max(1, Number(perPage) || 15);
        let safeCurrentPage = Math.max(1, Number(currentPage) || 1);

        const totalItems = await this.count()
        const totalPages = Math.max(1, Math.ceil(totalItems / safePerPage));
        const offset = (safeCurrentPage - 1) * safePerPage;

        const nextPage = safeCurrentPage < totalPages ? safeCurrentPage + 1 : null;
        const prevPage = safeCurrentPage > 1 ? safeCurrentPage - 1 : null;

        this.limit(safePerPage).offset(offset);
        const data = await this.get()

        return {
            data,
            pagination: {
                currentPage: safeCurrentPage,
                perPage: safePerPage,
                totalPages,
                totalItems: totalItems,
                nextPage,
                prevPage
            }
        }
    }

    async execute(operation: TDBQueryOperation) {
        const inputs: TDBCompilerInput = {
            data: this.data,
            limit: this.limitValue,
            offset: this.offsetValue,
            operation: operation,
            orders: this.orders,
            table: this.table,
            wheres: this.wheres,
            fields: this.selectFields
        }
        const compiler = new SQLCompiler(inputs)
        const {sql, bindings} = compiler.compile()
        return await this.driver.execute(sql, bindings)
    }

}