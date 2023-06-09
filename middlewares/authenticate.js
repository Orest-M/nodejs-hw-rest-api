const jwt = require('jsonwebtoken');

const HttpError = require('../helpers/HttpError');
const User = require('../models/user');

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
	try {
		const { authorization = '' } = req.headers;
		const [bearer, token] = authorization.split(' ');

		if (bearer !== 'Bearer') {
			throw HttpError(401, 'Not authorized');
		}

		const { id } = jwt.verify(token, SECRET_KEY);
		const user = await User.findById(id);

		if (!user || !user.token) {
			throw HttpError(401, 'Not authorized');
		}

		req.user = user;

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = authenticate;
