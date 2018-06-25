import * as Router from 'koa-router';
import {FlickrAPI} from './FlickrAPI';
import { Database } from './Database';

export class Controllers {

    public static async getNewData(context: Router.IRouterContext) {

        const f = new FlickrAPI();
        f.execute();
        context.body = JSON.stringify('')
        
    }

    public static async getInBounds(context: Router.IRouterContext) {

        const bounds = context.query;
        
        const db = new Database();
        const results = await db.getMany(`SELECT * FROM FLICKR WHERE latitude < ${parseFloat(bounds['lat_max']).toFixed(2)} AND latitude > ${parseFloat(bounds['lat_min']).toFixed(2)} AND longitude > ${parseFloat(bounds['lon_max']).toFixed(2)} AND longitude < ${parseFloat(bounds['lon_min']).toFixed(2)}`);
        
        context.body = JSON.stringify(results);
        
    }

    public static async test(context: Router.IRouterContext){
        console.log('---TEST---');
        context.body = JSON.stringify('---TEST---')
    }

}