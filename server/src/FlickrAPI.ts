import * as moment from 'moment';
import * as axios from 'axios';
import * as xmlp from 'xml2js';
import { Database } from './Database';
import { PhotoModel } from './PhotoObject.interface';

export class FlickrAPI {

    private apiKey: string;
    private static db: Database;

    constructor() {
        FlickrAPI.db = new Database();
        this.apiKey = '96e468d42446d50dc2b6725cd4128e2f';
    }

    public async execute() {
        const time = moment().unix() - 3600;
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.apiKey}&has_geo=1&min_upload_date=${time}&extras=geo,url_m,description,date_upload,owner_name,tags&accuracy=16&per_page=500`;
        const results = await this.executeCall(url);
        xmlp.parseString(results, (e,r) => {this.cleanData(r)});
    }

    public cleanData(result): void {
        const photos = result.rsp.photos[0].photo;
        let cleanedData = Array<PhotoModel>();
        photos.forEach(photo => {
            const photoData = photo['$'];
            let photoDataCleaned = <PhotoModel>(({ id, owner, title, dateupload, ownername, tags, latitude, longitude, place_id, url_m }) => ({ id, owner, title, dateupload, ownername, tags, latitude, longitude, place_id, url_m }))(photoData);
            console.log(photoDataCleaned);
            photoDataCleaned = FlickrAPI.replaceNull(photoDataCleaned);
            photoDataCleaned = FlickrAPI.addInsertationDate(photoDataCleaned);
            cleanedData.push(photoDataCleaned);            
        });
        FlickrAPI.db.insertMany(cleanedData, 'flickr');
    }

    public async executeCall(url: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            let response = await axios.default.get(url);
            resolve(response.data.toString());
        });
    }

    public static replaceNull(obj: PhotoModel): PhotoModel {
        Object.keys(obj).forEach(key => {
            obj['title'] = obj['title'].replace(/'/g, "");
            obj['ownername'] = obj['ownername'].replace(/'/g, "");
            obj['tags'] = obj['tags'].replace(/'/g, "");
            if(obj[key] === null || obj[key] === "" || obj[key] === undefined){
                obj[key] = 'NULL'
            }
        });
        return obj;
    }

    public static addInsertationDate(obj: PhotoModel): PhotoModel{        
        obj['date_entered'] = moment().unix();
        return obj;
    }
}