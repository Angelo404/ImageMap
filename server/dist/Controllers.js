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
exports.Controllers = void 0;
const FlickrAPI_1 = require("./FlickrAPI");
const Database_1 = require("./Database");
class Controllers {
    static getNewData(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const f = new FlickrAPI_1.FlickrAPI();
            f.execute();
            context.body = JSON.stringify('');
        });
    }
    static getInBounds(context) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('here 2');
            const bounds = context.query;
            const db = new Database_1.Database();
            const results = yield db.getMany(`SELECT * FROM FLICKR WHERE latitude < ${parseFloat(bounds['lat_max']).toFixed(2)} AND latitude > ${parseFloat(bounds['lat_min']).toFixed(2)} AND longitude > ${parseFloat(bounds['lon_max']).toFixed(2)} AND longitude < ${parseFloat(bounds['lon_min']).toFixed(2)}`);
            console.log('here');
            context.body = JSON.stringify(results);
        });
    }
    static test(context) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('---TEST---');
            context.body = JSON.stringify('---TEST---');
        });
    }
}
exports.Controllers = Controllers;
