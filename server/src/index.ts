import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as koaC from 'koa-cors';
import { Controllers } from './Controllers';
import { Database } from './Database';

const app = new Koa();
const router = new Router();

const db = new Database();
db.initDB('CREATE TABLE IF NOT EXISTS FLICKR(\
    id VARCHAR(24) UNIQUE,\
    owner VARCHAR(64) NOT NULL,\
    title VARCHAR(255) NOT NULL,\
    dateupload INTEGER NOT NULL,\
    ownername VARCHAR(64) NOT NULL,\
    tags VARCHAR(1024),\
    latitude REAL NOT NULL,\
    longitude REAL NOT NULL,\
    place_id VARCHAR(64) NOT NULL,\
    url_m VARCHAR(255) NOT NULL,\
    date_entered INTEGER NOT NULL)');
app.use(koaC());

router.post('/newPOI', Controllers.getNewData)
.get('/getInBounds', Controllers.getInBounds)
.get('/test', Controllers.test);

app.use(router.routes());

app.listen(3000);

console.log('Server running on port 3000');