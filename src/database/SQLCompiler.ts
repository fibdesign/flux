import {TDBCompilerInput} from "../types/TDatabase";


export default class SQLCompiler {
    private input: TDBCompilerInput;
    private bindings: any[] = [];

    constructor(input: TDBCompilerInput) {
        this.input = input;
    }

    compile(): { sql: string; bindings: any[] } {
        switch (this.input.operation) {
            case 'select':
            case 'count':
            case 'exists':
                return this.compileSelect();
            case 'insert':
                return this.compileInsert();
            case 'update':
                return this.compileUpdate();
            case 'delete':
                return this.compileDelete();
            default:
                throw new Error(`Unsupported operation: ${this.input.operation}`);
        }
    }

    private compileSelect(): { sql: string; bindings: any[] } {
        let sql = '';

        if (this.input.operation === 'count') {
            sql = `SELECT COUNT(*) AS count FROM \`${this.input.table}\``;
        } else if (this.input.operation === 'exists') {
            sql = `SELECT EXISTS(SELECT 1 FROM \`${this.input.table}\``;
        } else {
            let fields = '*';
            if (this.input.fields.length){
                fields = this.input.fields.join(',')
            }
            sql = `SELECT ${fields} FROM \`${this.input.table}\``;
        }

        const whereResult = this.compileWheres();
        if (whereResult) sql += ` WHERE ${whereResult}`;

        if (this.input.operation === 'exists') {
            sql += ') AS exists';
        }

        if (this.input.orders.length > 0) {
            sql += ' ORDER BY ' + this.input.orders
                .map(o => `\`${o.column}\` ${o.direction}`)
                .join(', ');
        }

        if (this.input.limit !== undefined) {
            sql += ` LIMIT ${this.input.limit}`;
        }

        if (this.input.offset !== undefined) {
            sql += ` OFFSET ${this.input.offset}`;
        }

        return { sql, bindings: this.bindings };
    }

    private compileWheres(): string | null {
        if (this.input.wheres.length === 0) return null;

        return this.input.wheres.map((where, index) => {
            const prefix = index === 0 ? '' : `${where.boolean} `;

            switch (where.type) {
                case 'basic':
                    this.bindings.push(where.value);
                    return `${prefix}\`${where.column}\` ${where.operator} ?`;
                case 'in':
                    this.bindings.push(...where.values);
                    return `${prefix}\`${where.column}\` IN (${where.values.map(() => '?').join(',')})`;
                case 'null':
                    return `${prefix}\`${where.column}\` IS NULL`;
            }
        }).join(' ');
    }

    private compileInsert(): { sql: string; bindings: any[] } {
        if (!this.input.data) throw new Error('No data provided for insert');

        const dataArray = Array.isArray(this.input.data)
            ? this.input.data
            : [this.input.data];

        const columns = Object.keys(dataArray[0]);
        const values = dataArray.map(item =>
            columns.map(col => {
                this.bindings.push(item[col]);
                return '?';
            })
        );

        const columnsClause = columns.map(col => `\`${col}\``).join(',');
        const valuesClause = values.map(val => `(${val.join(',')})`).join(',');

        return {
            sql: `INSERT INTO \`${this.input.table}\` (${columnsClause}) VALUES ${valuesClause}`,
            bindings: this.bindings
        };
    }

    private compileUpdate(): { sql: string; bindings: any[] } {
        if (!this.input.data || Array.isArray(this.input.data)) {
            throw new Error('Update requires a single object');
        }

        const setClause = Object.entries(this.input.data)
            .map(([key, value]) => {
                this.bindings.push(value);
                return `\`${key}\` = ?`;
            })
            .join(',');

        const whereResult = this.compileWheres();
        if (!whereResult) throw new Error('Update requires WHERE conditions');

        return {
            sql: `UPDATE \`${this.input.table}\` SET ${setClause} WHERE ${whereResult}`,
            bindings: this.bindings
        };
    }

    private compileDelete(): { sql: string; bindings: any[] } {
        const whereResult = this.compileWheres();
        if (!whereResult) throw new Error('Delete requires WHERE conditions');

        return {
            sql: `DELETE FROM \`${this.input.table}\` WHERE ${whereResult}`,
            bindings: this.bindings
        };
    }
}