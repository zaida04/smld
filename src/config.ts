require('dotenv').config();

if(!process.env.DOMAIN) throw new Error('You must provide a domain. Please create a .env file with the DOMAIN key');
if(!process.env.MONGO_URI) throw new Error('You must provide a mongo uri. Please create a .env file with the MONGO_URI key');
module.exports = {
	'port': process.env.PORT || '27345',
	'domain': process.env.DOMAIN,
	'mongo_uri': process.env.MONGO_URI
};