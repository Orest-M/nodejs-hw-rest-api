const Joi = require('joi');

const contactsService = require('../models/contacts');
const HttpError = require('../helpers/HttpError');

const contactAddSchema = Joi.object({
	name: Joi.string().required().messages({
		'any.required': `missing required name field`,
	}),
	email: Joi.string().required().messages({
		'any.required': `missing required email field`,
	}),
	phone: Joi.string().required().messages({
		'any.required': `missing required phone field`,
	}),
});

const listContacts = async (req, res, next) => {
	try {
		const contacts = await contactsService.listContacts();
		res.json(contacts);
	} catch (error) {
		next(error);
	}
};

const getContactById = async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const contact = await contactsService.getContactById(contactId);

		if (!contact) {
			throw HttpError(404, `Not found`);
		}

		res.json(contact);
	} catch (error) {
		next(error);
	}
};

const addContact = async (req, res, next) => {
	try {
		const { error } = contactAddSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}

		const { name, email, phone } = req.body;
		const result = await contactsService.addContact(name, email, phone);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

const removeContact = async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const contact = await contactsService.removeContact(contactId);

		if (!contact) {
			throw HttpError(404, `Not found`);
		}

		res.json({
			message: 'Delete success',
		});
	} catch (error) {
		next(error);
	}
};

const updateContactById = async (req, res, next) => {
	try {
		const { error } = contactAddSchema.validate(req.body);
		if (error) {
			throw HttpError(400, 'missing fields');
		}

		const { contactId } = req.params;
		const result = await contactsService.updateContactById(contactId, req.body);

		if (!result) {
			throw HttpError(404, `Not found`);
		}

		res.json(result);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	listContacts,
	getContactById,
	addContact,
	removeContact,
	updateContactById,
};
