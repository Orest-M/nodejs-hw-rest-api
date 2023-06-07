const { Schema, model } = require('mongoose');
const HandleMongooseError = require('../helpers/HandleMongooseError');

const contactSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Set name for contact'],
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
	},
	{ versionKey: false, timestamps: true }
);

contactSchema.post('save', HandleMongooseError);

const Contact = model('Contact', contactSchema);

module.exports = Contact;
