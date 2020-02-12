const Twilio = require('./Twilio');
const Search = require('./Search');

const constructorMethod = (app) => {
	app.use('/twilio', Twilio);
	app.use('/search', Search);
	app.use('*', (req, res) => {
		const e = '404: Page Not Found!';
		res.status(404).json({ errors: e });
	});
};

module.exports = constructorMethod;
