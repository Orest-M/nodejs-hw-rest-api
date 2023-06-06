require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const main = async () => {
	try {
		await mongoose.connect(process.env.DB_URI);
		console.log('Database connection successful');

		app.listen(3000, () => {
			console.log('Server running. Use our API on port: 3000');
		});
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

main();
