"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const pg = require("pg");
class Database {
    constructor() {
        this.connString = 'postgres://username:supersecret@database_1/dbname';
    }
    initDB(initString) {
        return __awaiter(this, void 0, void 0, function* () {
            Database.client = new pg.Client(this.connString);
            try {
                yield Database.client.connect();
            }
            catch (err) {
                console.log(err);
            }
            try {
                yield Database.client.query(initString);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    insertMany(data, table) {
        return __awaiter(this, void 0, void 0, function* () {
            data.forEach((entry) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield Database.client.query(this.createInsertString(entry, table));
                }
                catch (err) {
                    console.log('--- FAULTY QUERY ---');
                    console.log(this.createInsertString(entry, table));
                    console.log('--- ERROR ---');
                    console.log(err);
                }
            }));
        });
    }
    createInsertString(obj, table) {
        let insertPart = 'INSERT INTO ' + table.toUpperCase() + '(';
        let arrayOfKeys = Object.keys(obj);
        let arrayOfValues = Object.keys(obj).map(key => "'" + obj[key] + "'");
        insertPart += arrayOfKeys.join(', ') + ')';
        let valuesPart = ' VALUES (';
        valuesPart += arrayOfValues.join(', ');
        valuesPart += ')';
        return insertPart + valuesPart;
    }
    getMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const results = yield Database.client.query(query);
                    resolve(results.rows);
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
            }));
        });
    }
}
exports.Database = Database;
