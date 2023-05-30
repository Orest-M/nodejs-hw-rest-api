const HttpError = require('../helpers/HttpError');

const validateBody = () => {
	const func = (req, res, next) => {
		try {
			if (!req.body.name && !req.body.email && !req.body.phone) {
				throw HttpError(400, 'missing fields');
			}
			next();
		} catch (error) {
			next(error);
		}
	};
	return func;
};

module.exports = validateBody;
