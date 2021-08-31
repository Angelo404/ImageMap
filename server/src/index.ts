import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as koaC from 'koa-cors';
import { Controllers } from './Controllers';

const app = new Koa();
const router = new Router();

app.use(koaC());

router.post('/newPOI', Controllers.getNewData)
.get('/getInBounds', Controllers.getInBounds)
.get('/test', Controllers.test)
.post('/progress', Controllers.saveProgress);

app.use(router.routes());

app.listen(3000);

console.log('Server running on port 3000');