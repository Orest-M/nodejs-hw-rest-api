const mongoose = require('mongoose');
const HandleMongooseError = require('../helpers/HandleMongooseError');

const userSchema = new mongoose.Schema(
	{
		password: {
			type: String,
			required: [true, 'Set password for user'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ['starter', 'pro', 'business'],
			default: 'starter',
		},
		avatarURL: {
			type: String,
		},
		token: {
			type: String,
			default: '',
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

userSchema.post('save', HandleMongooseError);

module.exports = mongoose.model('user', userSchema);
