const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const HttpError = require('../helpers/HttpError');

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const currentUser = await User.findOne({ email });

		if (currentUser !== null) {
			throw HttpError(409, `Email in use`);
		}

		const newPass = await bcrypt.hash(password, 10);

		const user = {
			email,
			password: newPass,
		};

		await User.create(user);

		res.status(201).json(user);
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user === null) {
			throw HttpError(401, `Email or password is wrong`);
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw HttpError(401, `Email or password is wrong`);
		}

		const { _id: id } = user;

		const payload = { id };
		const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

		res.status(200).json({
			token,
			user: {
				email,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		next(error);
	}
};

const logout = async (req, res, next) => {
	try {
		const { _id } = req.user;

		if (!_id) {
			throw HttpError(401, `Not authorized`);
		}

		await User.findByIdAndUpdate(_id, { token: '' });

		res.status(204).json('No content');
	} catch (error) {
		next(error);
	}
};

const getCurrent = (req, res, next) => {
	try {
		const { email, subscription } = req.user;

		if (!req.user) {
			throw HttpError(401, `Not authorized`);
		}

		res.json({ email, subscription });
	} catch (error) {
		next(error);
	}
};

module.exports = { register, login, logout, getCurrent };
