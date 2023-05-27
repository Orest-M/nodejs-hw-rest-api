const express = require('express');
const contactAddSchema = require('../../schemas/contacts-schemas');
const validateBody = require('../../decorators/validateBody');
const validateAllBody = require('../../decorators/validateAllBody');

const {
	listContacts,
	getContactById,
	addContact,
	removeContact,
	updateContactById,
} = require('../../controllers/contacts-controllers');

const router = express.Router();

router.get('/', listContacts);

router.get('/:contactId', getContactById);

router.post('/', validateBody(contactAddSchema), addContact);

router.delete('/:contactId', removeContact);

router.put(
	'/:contactId',
	validateAllBody(),
	validateBody(contactAddSchema),
	updateContactById
);

module.exports = router;
