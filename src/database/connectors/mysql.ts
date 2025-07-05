import type {Pool, PoolConnection} from 'mysql2/promise';
import mysql from 'mysql2/promise';
import {IDBDriver, IDBDriverOptions} from "../../types/TDatabase";
import {FluxErrorHandler} from "../../utils/FluxErrorHandler";

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
        }
    }

    public async execute(sql: string, bindings: any[]): Promise<any> {
        if (!this.connection) return ;

        const [data] = await this.connection.execute(sql, bindings);
        this.connection.release();
        return data;
    }
}