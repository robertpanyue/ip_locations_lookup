const express = require('express');
const router = express.Router();

const xss = require('xss');
var cors = require('cors');

const { config } = require('../config');

const client = require('twilio')(config.accountSID, config.authToken);

router.post('/', cors(), async (req, res) => {
	res.header('Content-Type', 'application/json');
	client.messages
		.create({
			body: `Here is the info of IP address: IP address: ${req.body.data.ip}, 
            Country Name: ${req.body.data.country_name},
            State: ${req.body.data.state_prov}, 
            District: ${req.body.data.district},
            City: ${req.body.data.city},
            ZipCode: ${req.body.data.zipcode}`,
			from: '+18647540960',
			to: `+1${req.body.phone}`
		})
		.then((message) => {
			res.status(200).json({ data: message });
			return;
		})
		.catch((error) => {
			res.status(400).json({ error: error });
		});
});

module.exports = router;
