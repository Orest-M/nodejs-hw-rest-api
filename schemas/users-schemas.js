const Joi = require('joi');

const userSchema = Joi.object({
	email: Joi.string().required().messages({
		'any.required': `missing required email field`,
	}),
	password: Joi.string().required().messages({
		'any.required': `missing required password field`,
	}),
});

const verifySchema = Joi.object({
	email: Joi.string().required().messages({
		'any.required': `missing required field email`,
	}),
});

module.exports = { userSchema, verifySchema };
