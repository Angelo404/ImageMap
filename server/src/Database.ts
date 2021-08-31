import * as pg from 'pg';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';

export class Database {

    private connString: string;
    private static client: pg.Client;
    private static conn: pg.Connection;

    constructor() {
        this.connString = 'postgres://username:supersecret@database/dbname';
        Database.client = new pg.Client(this.connString);
        Database.conn = new pg.Connection({connectionString: this.connString});
    }

    // public async connect() {
    //     try {
    //         await Database.client.connect();
    //         await Database
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    public async insertMany(data?: Array<object>, table?: string) {
        await this.connect()
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
        Database.conn = new pg.Connection({connectionString: this.connString});
        console.log(Database.conn.query(query));
        return new Promise<Array<object>>(async (resolve, reject) => {
            try {
                // const results = Database.conn.query(query);
                resolve([]);
            } catch (err) {
                console.log(err)
                reject(err);
            }
        });
    }

    public async toCSV() {
        console.log('!!!!');
        const results = await Database.client.query(`SELECT * FROM FLICKR`);
        const ws = fs.createWriteStream("sample_table.csv");
        fastcsv.write(results.rows, { headers: true }).on('finish', function() {console.log('Writing to csv')}).pipe(ws);
    }

    public fromCSV() {

    }
}