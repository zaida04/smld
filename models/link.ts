import { Schema, model } from "mongoose"

const link = new Schema({
	short: String,
	target: String
});

export default model('link', link);