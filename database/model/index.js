const mongoose = require('mongoose');

const Users = mongoose.Schema(
	{
		username: { type: String },
		password: { type: String },
		apikey: { type: String },
		defaultKey: { type: String },
		premium: { type: Array },
		limit: { type: Number },
		role: { type: String, enum: ['admin', 'member', 'staff'], default: 'member' },
	},
	{ versionKey: false }
);

const visitScema = new mongoose.Schema(
	{
		counter: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);


module.exports.User = mongoose.model('users', Users);
module.exports.visits = mongoose.model('visits', visitScema);