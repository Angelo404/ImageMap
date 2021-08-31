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
exports.FlickrAPI = void 0;
const moment = require("moment");
const axios = require("axios");
const xmlp = require("xml2js");
const Database_1 = require("./Database");
class FlickrAPI {
    constructor() {
        FlickrAPI.db = new Database_1.Database();
        this.apiKey = '96e468d42446d50dc2b6725cd4128e2f';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const time = moment().unix() - 3600;
            const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.apiKey}&has_geo=1&min_upload_date=${time}&extras=geo,url_m,description,date_upload,owner_name,tags&accuracy=16&per_page=500`;
            const results = yield this.executeCall(url);
            xmlp.parseString(results, (e, r) => { this.cleanData(r); });
        });
    }
    cleanData(result) {
        const photos = result.rsp.photos[0].photo;
        let cleanedData = Array();
        photos.forEach(photo => {
            const photoData = photo['$'];
            let photoDataCleaned = (({ id, owner, title, dateupload, ownername, tags, latitude, longitude, place_id, url_m }) => ({ id, owner, title, dateupload, ownername, tags, latitude, longitude, place_id, url_m }))(photoData);
            photoDataCleaned = FlickrAPI.replaceNull(photoDataCleaned);
            photoDataCleaned = FlickrAPI.addInsertationDate(photoDataCleaned);
            cleanedData.push(photoDataCleaned);
        });
        FlickrAPI.db.insertMany(cleanedData, 'flickr');
    }
    executeCall(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let response = yield axios.default.get(url);
                resolve(response.data.toString());
            }));
        });
    }
    static replaceNull(obj) {
        Object.keys(obj).forEach(key => {
            obj['title'] = obj['title'].replace(/'/g, "");
            obj['ownername'] = obj['ownername'].replace(/'/g, "");
            obj['tags'] = obj['tags'].replace(/'/g, "");
            if (obj[key] === null || obj[key] === "" || obj[key] === undefined) {
                obj[key] = 'NULL';
            }
        });
        return obj;
    }
    static addInsertationDate(obj) {
        obj['date_entered'] = moment().unix();
        return obj;
    }
}
exports.FlickrAPI = FlickrAPI;
