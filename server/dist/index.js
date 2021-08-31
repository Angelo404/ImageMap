"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const koaC = require("koa-cors");
const Controllers_1 = require("./Controllers");
const Database_1 = require("./Database");
const app = new Koa();
const router = new Router();
const db = new Database_1.Database();
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
router.post('/newPOI', Controllers_1.Controllers.getNewData)
    .get('/getInBounds', Controllers_1.Controllers.getInBounds)
    .get('/test', Controllers_1.Controllers.test);
app.use(router.routes());
app.listen(3000);
console.log('Server running on port 3000');
