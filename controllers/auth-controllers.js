const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const User = require('../models/user');
const HttpError = require('../helpers/HttpError');
const avatarsPath = path.resolve('public', 'avatars');

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
			avatarURL: gravatar.url(email).slice(2),
		};

		const newUser = await User.create(user);

		res.status(201).json({
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
			},
		});
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

const changeAvatar = async (req, res, next) => {
	try {
		const { path: oldPath, filename } = req.file;

		const resizeAvatar = await Jimp.read(oldPath);
		await resizeAvatar
			.cover(
				250,
				250,
				Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
			)
			.writeAsync(oldPath);

		const newPath = path.join(avatarsPath, filename);
		await fs.rename(oldPath, newPath, (err) => {
			if (err) throw err;
		});

		const avatar = path.join('public', 'avatars', filename);

		const { _id: id } = req.user;
		const result = await User.findByIdAndUpdate(id, { avatarURL: avatar });

		if (!result) {
			throw HttpError(404, `Not found`);
		}

		res.json({
			avatarURL: avatar,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { register, login, logout, getCurrent, changeAvatar };
