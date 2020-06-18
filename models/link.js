const {
	Schema,
	model
} = require('mongoose');

const Link = new Schema({
	short: String,
	target: String
});

module.exports = model('Link', Link);