const express = require('express');
const Joi = require('joi');

const contactsService = require('../../models/contacts');
const HttpError = require('../../helpers/HttpError');

const router = express.Router();

const contactAddSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
	try {
		const contacts = await contactsService.listContacts();
		res.json(contacts);
	} catch (error) {
		next(error);
	}
});

router.get('/:contactId', async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const contact = await contactsService.getContactById(contactId);

		if (!contact) {
			throw HttpError(404, `Movie with ${contactId} not found`);
		}

		res.json(contact);
	} catch (error) {
		next(error);
	}
});

router.post('/', async (req, res, next) => {
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
});

router.delete('/:contactId', async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const contact = await contactsService.removeContact(contactId);

		if (!contact) {
			throw HttpError(404, `Movie with ${contactId} not found`);
		}

		res.json({
			message: 'Delete success',
		});
	} catch (error) {
		next(error);
	}
});

router.put('/:contactId', async (req, res, next) => {
	try {
		const { error } = contactAddSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}

		const { contactId } = req.params;
		const result = await contactsService.updateContactById(contactId, req.body);

		if (!result) {
			throw HttpError(404, `Movie with ${contactId} not found`);
		}

		res.json(result);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
