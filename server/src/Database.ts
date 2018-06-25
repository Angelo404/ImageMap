import * as pg from 'pg';

export class Database {

    private connString: string;
    private static client: pg.Client;

    constructor() {
        this.connString = 'postgres://username:supersecret@database_1/dbname';
    }

    public async initDB(initString: string) {
        Database.client = new pg.Client(this.connString);

        try {
            await Database.client.connect();
        } catch (err) {
            console.log(err);
        }

        try {
            await Database.client.query(initString);
        } catch (err) {
            console.log(err);
        }
    }

    public async insertMany(data?: Array<object>, table?: string) {

        data.forEach(async (entry) => {
            try {
                await Database.client.query(this.createInsertString(entry, table))
            } catch (err) {
                console.log('--- FAULTY QUERY ---');
                console.log(this.createInsertString(entry, table));
                console.log('--- ERROR ---');
                console.log(err);
            }
        });
    }

    public createInsertString(obj: object, table: string): string {
        let insertPart = 'INSERT INTO ' + table.toUpperCase() + '(';
        let arrayOfKeys = Object.keys(obj);
        let arrayOfValues = Object.keys(obj).map(key => "'" + obj[key] + "'");
        insertPart += arrayOfKeys.join(', ') + ')';
        let valuesPart = ' VALUES (';
        valuesPart += arrayOfValues.join(', ');
        valuesPart += ')';
        return insertPart + valuesPart;
    }

    public async getMany(query: string): Promise<Array<object>> {
        return new Promise<Array<object>>(async (resolve, reject) => {
            try {
                const results = await Database.client.query(query);
                resolve(results.rows);
            } catch (err) {
                console.log(err)
                reject(err);
            }
        });
    }
}