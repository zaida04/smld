const app = require('express')();
const {static} = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {domain,port,mongo_uri} = require('./config');
app.locals.domain = domain;
mongoose.connect(mongo_uri, {useUnifiedTopology: true,useNewUrlParser: true}, () => console.log('connected to mongo db')); //connect to the DB

let link = require('./models/link');
app.use(static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
let url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

app.get('/', async (_, res) => res.sendFile('index.html'));
app.post('/b/create', async (req, res) => {
	if(!req.body.target.match(url_regex)) return res.send("Not a well formed url")
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
app.get('/:id', async (req, res) => {
	let temp = await link.findOne({
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
})

app.listen(port, '0.0.0.0', console.log(`smld started at port ${port}`));