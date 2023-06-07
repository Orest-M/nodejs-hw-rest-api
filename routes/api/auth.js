const express = require('express');

const validateBody = require('../../decorators/validateBody');
const authenticate = require('../../middlewares/authenticate');
const {
	register,
	login,
	logout,
	getCurrent,
} = require('../../controllers/auth-controllers');
const { userSchema } = require('../../schemas/users-schemas');

const router = express.Router();
const jsonParser = express.json();

router.post('/register', jsonParser, validateBody(userSchema), register);

router.post('/login', jsonParser, validateBody(userSchema), login);

router.post('/logout', authenticate, logout);

router.get('/current', authenticate, getCurrent);

module.exports = router;
