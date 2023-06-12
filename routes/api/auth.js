const express = require('express');

const validateBody = require('../../decorators/validateBody');
const authenticate = require('../../middlewares/authenticate');
const upload = require('../../middlewares/upload');
const {
	register,
	login,
	logout,
	getCurrent,
	changeAvatar,
	verifyEmail,
	verifyEmailAgain,
} = require('../../controllers/auth-controllers');
const { userSchema, verifySchema } = require('../../schemas/users-schemas');

const router = express.Router();
const jsonParser = express.json();

router.post('/register', jsonParser, validateBody(userSchema), register);

router.post('/login', jsonParser, validateBody(userSchema), login);

router.post('/logout', authenticate, logout);

router.get('/current', authenticate, getCurrent);

router.patch('/avatars', authenticate, upload.single('avatar'), changeAvatar);

router.get('/verify/:verificationToken', verifyEmail);

router.post('/verify', validateBody(verifySchema), verifyEmailAgain);

module.exports = router;
