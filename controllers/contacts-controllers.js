const HttpError = require('../helpers/HttpError');
const Contact = require('../schemas/mongoose-schema');

const listContacts = async (req, res, next) => {
	try {
		const { _id: owner } = req.user;
		const contacts = await Contact.find({ owner }).populate(
			'owner',
			'email subscription'
		);
		res.json(contacts);
	} catch (error) {
		next(error);
	}
};

const getContactById = async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const contact = await Contact.findById(contactId);

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
		if (!req.body.name && !req.body.email && !req.body.phone) {
			throw HttpError(400, 'missing fields');
		}

		const { _id: owner } = req.user;
		const { name, email, phone } = req.body;
		const result = await Contact.create({ name, email, phone, owner });

		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

const removeContact = async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const contact = await Contact.findByIdAndRemove(contactId);

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
		const { contactId } = req.params;
		const result = await Contact.findByIdAndUpdate(contactId, req.body, {
			new: true,
		});

		if (!result) {
			throw HttpError(404, `Not found`);
		}

		res.json(result);
	} catch (error) {
		next(error);
	}
};

const updateStatusContact = async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const result = await Contact.findByIdAndUpdate(contactId, req.body, {
			new: true,
		});

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
	updateStatusContact,
};
