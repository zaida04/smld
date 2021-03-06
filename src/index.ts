import * as express from "express";
const app: any = express();
import * as mongoose from "mongoose"
import * as bodyParser from "body-parser"

const {
	domain,
	port,
	mongo_uri
} = require('./config');
app.locals.domain = domain;
mongoose.connect(mongo_uri, {
	useUnifiedTopology: true,
	useNewUrlParser: true
}, () => console.log('connected to mongo db')); //connect to the DB

import link from "../models/link";
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.set('views', __dirname + '/../views');
app.set('view engine', 'pug');
//eslint-disable-next-line no-useless-escape
let url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

app.get('/', async (_: never, res: express.Response) => res.sendFile('index.html'));
app.post('/b/create', async (req: express.Request, res: express.Response) => {
	if (!req.body.target || !req.body.target.match(url_regex)) return res.send('Not a well formed url');
	if (!req.body.target.startsWith('http') || !req.body.target.startsWith('https')) req.body.target = 'http://' + req.body.target;
	let short = Math.random().toString(36).substring(9);
	let temp = new link({
		'target': req.body.target,
		'short': short
	});
	let temp_link = await temp.save();
	return res.render('result', {
		'result': temp_link
	});
});
app.post('/a/create', async (req, res) => {
	if (!req.body.target || !req.body.target.match(url_regex)) return res.send('Not a well formed url');
	if (!req.body.target.startsWith('http') || !req.body.target.startsWith('https')) req.body.target = 'http://' + req.body.target;
	let check:any = await link.findOne({
		'target': req.body.target
	});
	if (check) {
		return res.json({
			'success': true,
			'data': {
				'link': domain + '/' + check.short
			}
		});
	}
	let short: string = Math.random().toString(36).substring(9);
	if (await link.findOne({ 'short': short })) short = Math.random().toString(36).substring(9);
	let temp:any = new link({
		'target': req.body.target,
		'short': short
	});
	let temp_link = await temp.save();
	return res.json({
		'success': true,
		'data': {
			'link': domain + '/' + temp_link.short
		}
	});
});
app.get('/:id', async (req, res) => {
	let temp:any = await link.findOne({
		'short': req.params.id
	});
	if (!temp) return res.send('Sorry, but that short link doesn\'t exist');
	res.redirect(temp.target);
});
app.get('/:id/data', async (req, res) => {
	let temp = await link.findOne({
		'short': req.params.id
	});
	if (!temp) return res.send('Sorry, but that short link doesn\'t exist');
	res.json(temp);
});

app.delete('/:id', async (req, res) => {
	let temp:any = await link.findOne({
		'short': req.params.id
	});
	if (!temp) return res.send('Sorry, but that short link doesn\'t exist');
	await temp.delete();
	res.json({
		'status': 'success'
	});
});

app.listen(port, '0.0.0.0', console.log(`smld started at port ${port}`));