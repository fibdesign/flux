import {IDBDriver, IDBDriverOptions} from "../types/TDatabase";
import {FluxErrorHandler} from "../utils/FluxErrorHandler";
import {MySQLDriver} from "./connectors/mysql";
import {ENV} from "../utils/ENV";

export class Database {
    private readonly envDriver: string;
    private readonly driverOptions: IDBDriverOptions;
    public driver: IDBDriver | undefined;
    constructor() {
        this.envDriver = ENV.DB_DRIVER ?? 'MySQL';
        if (!ENV.DB_DATABASE || !ENV.DB_USER || !ENV.DB_PASSWORD){
            FluxErrorHandler.error('Database options missing')
        }
        this.driverOptions = {
            host: ENV.DB_HOST ?? 'localhost',
            database: ENV.DB_DATABASE,
            user: ENV.DB_USER,
            password: ENV.DB_PASSWORD,
        }
    }

    public async init(){
        this.driver = this.setup()
        await this.driver.connect()
    }

    setup(): IDBDriver {
        switch (this.envDriver) {
            case 'MySQL':
                 return new MySQLDriver(this.driverOptions);
            default: FluxErrorHandler.error('Unknown Database driver')
        }
    }
}