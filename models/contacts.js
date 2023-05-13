const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.resolve('models', 'contacts.json');

async function listContacts() {
	const data = await fs.readFile(contactsPath);
	return JSON.parse(data);
}

async function getContactById(contactId) {
	const data = await listContacts();
	const contactById = data.find((item) => item.id === contactId);
	return contactById || null;
}

async function removeContact(contactId) {
	const data = await listContacts();
	const index = data.findIndex((item) => item.id === contactId);
	if (index === -1) {
		return null;
	}
	const [result] = data.splice(index, 1);
	await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

	return result;
}

const updateContactById = async (id, data) => {
	const contacts = await listContacts();
	const index = contacts.findIndex((item) => item.id === id);
	if (index === -1) {
		return null;
	}
	contacts[index] = { id, ...data };
	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	return data[index];
};

async function addContact(name, email, phone) {
	const data = await listContacts();
	const newContact = {
		id: nanoid(),
		name,
		email,
		phone,
	};
	data.push(newContact);
	await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
	return newContact;
}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContactById,
};
