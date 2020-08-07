import { Schema, model } from "mongoose"

const Link = new Schema({
	short: String,
	target: String
});

export default model('Link', Link);