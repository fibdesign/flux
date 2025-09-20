import type {Pool, PoolConnection} from 'mysql2/promise';
import mysql from 'mysql2/promise';
import {IDBDriver, IDBDriverOptions} from "../../types/TDatabase";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";
import {IMigration} from "../../types/IMigration";
import {IMigrationAction} from "../../types/IMigrationAction";
import {logMigration} from "../../utils/logMigration";
import {COLORS} from "../../constants/COLORS";

export class MySQLDriver implements IDBDriver{
    private pool: Pool;
    private connection: PoolConnection | undefined;
    constructor(options: IDBDriverOptions) {
        this.pool = mysql.createPool({
            host: options.host,
            user: options.user,
            password: options.password,
            database: options.database,
        })
    }

    async connect() {
        try {
            this.connection = await this.pool.getConnection();
            await this.connection.ping(); // Test the connection
            console.log('✅ Database connection established');
        } catch (error: any) {
            if (error.code === 'ECONNREFUSED') {
                FluxErrorHandler.error(`
                🚨 Database connection refused! Possible reasons:
                1. MySQL server isn't running - start it first!
                2. Wrong host/port configuration
                3. Firewall blocking the connection
                `);
            } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
                FluxErrorHandler.error('❌ Access denied - check your database credentials!');
            } else if (error.code === 'ER_BAD_DB_ERROR') {
                FluxErrorHandler.error(`❌ Database doesn't exist!`);
            } else {
                FluxErrorHandler.error(`❌ Database connection failed: ${error.message}`);
            }
        }
    }

    async close() {
        if (this.connection) {
            this.connection.release();
            this.connection = undefined;
        }
        if (this.pool) {
            await this.pool.end();
        }
    }

    public async execute(sql: string, bindings: any[]): Promise<any> {
        if (!this.connection) return ;

        const [data] = await this.connection.execute(sql, bindings);
        this.connection.release();
        return data;
    }

    async runMigrations(migrations: IMigration[]): Promise<void> {
        if (!this.connection) return;

        // Create migrations table if it doesn't exist
        await this.execute(`
            CREATE TABLE IF NOT EXISTS _migrations (
                                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                                       name VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
        `, []);

        for (const migration of migrations) {
            // Check if migration already executed

            const executed = await this.execute(
                'SELECT name FROM _migrations WHERE name = ?',
                [migration.name]
            );

            if (executed.length > 0) {
                logMigration.info(`Skipped: ${migration.name} (already executed)`);
                continue;
            }
            logMigration.start(migration.name);
            // Execute migration actions
            for (const action of migration.up) {
                try {
                    await this.executeMigrationAction(action);
                    // Log action success in a friendly way
                    switch(action.action) {
                        case 'createTable':
                            logMigration.success(`Created table ${action.table}`);
                            break;
                        case 'addColumn':
                            logMigration.success(`Added column ${action.column!.name} to ${action.table}`);
                            break;
                        case 'dropTable':
                            logMigration.success(`Dropped table ${action.table}`);
                            break;
                        case 'createIndex':
                            logMigration.success(`Created index on ${action.table} (${action.column!.name})`);
                            break;
                        default:
                            logMigration.success(`Executed action ${action.action}`);
                    }
                } catch (err: any) {
                    logMigration.error(`Failed action ${action.action} on ${action.table}: ${err.message}`);
                    FluxErrorHandler.runtime(`Failed action ${action.action} on ${action.table}: ${err.message}`);
                }
            }

            // Record migration as executed
            await this.execute(
                'INSERT INTO _migrations (name) VALUES (?)',
                [migration.name]
            );
            logMigration.success(`Migration ${migration.name} completed`);
        }

        await this.pool.end();
    }
    private async executeMigrationAction(action: IMigrationAction): Promise<void> {
        let sql = '';

        switch (action.action) {
            case 'createTable':
                sql = this.generateCreateTableSQL(action);
                break;
            case 'addColumn':
                sql = this.generateAddColumnSQL(action);
                break;
            case 'dropTable':
                sql = `DROP TABLE IF EXISTS ${action.table}`;
                break;
            case 'createIndex':
                sql = this.generateCreateIndexSQL(action);
                break;
            // Add more cases for other actions
            default:
                throw FluxErrorHandler.runtime(`Unknown migration action: ${action.action}`);
        }

        await this.execute(sql, []);
    }
    private mapType(type: string): string {
        switch (type.toLowerCase()) {
            case 'string':
                return 'VARCHAR(255)';
            case 'int':
            case 'integer':
                return 'INT';
            case 'boolean':
            case 'bool':
                return 'TINYINT(1)';
            case 'text':
                return 'TEXT';
            case 'datetime':
                return 'DATETIME';
            default:
                return type.toUpperCase(); // fallback for already correct MySQL type
        }
    }
    private generateCreateTableSQL(action: IMigrationAction): string {
        const columns = action.fields!.map(field => {
            let columnSQL = `${field.name} ${this.mapType(field.type)}`;

            if (field.options) {
                if (field.options.nullable) columnSQL += ' NULL';
                else columnSQL += ' NOT NULL';

                if (field.options.unique) columnSQL += ' UNIQUE';
                if (field.options.primary) columnSQL += ' PRIMARY KEY';
                if (field.options.default !== undefined) columnSQL += ` DEFAULT ${this.escapeValue(field.options.default)}`;
            }

            return columnSQL;
        }).join(', ');

        return `CREATE TABLE IF NOT EXISTS ${action.table} (${columns})`;
    }

    private generateAddColumnSQL(action: IMigrationAction): string {
        const field = action.column!;
        let columnSQL = `ALTER TABLE ${action.table} ADD COLUMN ${field.name} ${this.mapType(field.type)}`;

        if (field.options) {
            if (field.options.nullable) columnSQL += ' NULL';
            else columnSQL += ' NOT NULL';

            if (field.options.unique) columnSQL += ' UNIQUE';
            if (field.options.default !== undefined) columnSQL += ` DEFAULT ${this.escapeValue(field.options.default)}`;
        }

        return columnSQL;
    }

    private generateCreateIndexSQL(action: IMigrationAction): string {
        const indexName = `idx_${action.table}_${action.column!.name}`;
        return `CREATE INDEX ${indexName} ON ${action.table} (${action.column!.name})`;
    }

    private escapeValue(value: any): string {
        if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`;
        }
        return value;
    }

    async dropAllTables(): Promise<void> {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }

        try {
            const line = `${COLORS.Dim}────────────────────────────────────────────${COLORS.Reset}`;
            console.log('');
            console.log(`${COLORS.Yellow}⚠️  Dropping all tables...${COLORS.Reset}`);
            console.log(line);

            // Disable foreign key checks
            await this.execute('SET FOREIGN_KEY_CHECKS = 0', []);

            // Get all table names in the current database
            const result = await this.execute(
                `SELECT table_name
             FROM information_schema.tables
             WHERE table_schema = DATABASE()
               AND table_type = 'BASE TABLE'`,
                []
            );

            const tables = Array.isArray(result) ? result : [result];

            if (tables.length === 0) {
                console.log(`  ➜  ${COLORS.Cyan}No tables found in database.${COLORS.Reset}`);
            } else {
                for (const table of tables) {
                    const tableName = table.table_name || table.TABLE_NAME;
                    console.log(`  ➜  ${COLORS.Dim}Dropping table:${COLORS.Reset} ${COLORS.Magenta}${tableName}${COLORS.Reset}`);
                    await this.execute(`DROP TABLE IF EXISTS ${tableName}`, []);
                }
                console.log(line);
                console.log(`${COLORS.Green}✅  All ${tables.length} tables dropped successfully!${COLORS.Reset}`);
            }

            // Re-enable foreign key checks
            await this.execute('SET FOREIGN_KEY_CHECKS = 1', []);
            console.log(line);
        } catch (error: any) {
            // Ensure foreign key checks are re-enabled even if an error occurs
            await this.execute('SET FOREIGN_KEY_CHECKS = 1', []);
            FluxErrorHandler.error(`Failed to drop all tables: ${error.message}`);
            throw error;
        }
    }


}