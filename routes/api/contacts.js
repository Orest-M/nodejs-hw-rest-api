const express = require('express');

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

router.post('/', addContact);

router.delete('/:contactId', removeContact);

router.put('/:contactId', updateContactById);

module.exports = router;
