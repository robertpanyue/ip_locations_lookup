const express = require('express');
const router = express.Router();
const data = require('../data');
const historyData = data.History;
const xss = require('xss');
const cors = require('cors');
const axios = require('axios');

const { config } = require('../config.js');

router.post('/', cors(), async (req, res) => {
	try {
		console.log('post');
		let ip = xss(req.body.ip);
		let url = 'https://api.ipgeolocation.io/ipgeo?apiKey=' + config.iplookup + '&ip=' + ip;
		let result = await axios.get(url);
		let history = await historyData.addHistory(result.data);
		res.status(200).json({ data: history });
		return;
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: 'Cannot get ip address. Ip address may be invalid' });
		return;
	}
});

router.get('/history', cors(), async (req, res) => {
	try {
		let result = null;

		//no query provided
		if (Object.keys(req.query).length == 0) {
			console.log('no query and return 100 result');
			result = await historyData.getAllHistoryByLastN(100);
		}
		if (req.query.start && req.query.end) {
			console.log('start and end');
			result = await historyData.getAllHistoryByDateRange(req.query.start, req.query.end);
		}

		if (req.query.last) {
			console.log('lastN');
			if (!isNaN(parseInt(req.query.last))) {
				result = await historyData.getAllHistoryByLastN(parseInt(req.query.last));
			} else {
				res.status(406).json({ error: 'The input of last query should be a number' });
				return;
			}
		}

		if (result == null) {
			res.status(400).json({ error: 'No result' });
			return;
		}

		res.status(200).json(result);
		return;
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: error });
		return;
	}

	//     //---------------------------
	// 	let type = xss(req.body.historyType);
	// 	let data = xss(req.body.body);

	// 	if (type == 'normal') {
	// 		let history = await historyData.getAllHistory();
	// 		res.status(200).json({ data: history });
	// 		return;
	// 	}

	// 	if (!data) throw 'filter data is not provided';

	// 	if (type == 'range') {
	// 		if (!data.start || !data.end) throw 'filter data needs start and end date';
	// 		let rangeHistory = await historyData.getAllHistoryByDateRange(data.start, data.end);
	// 		res.status(200).json({ data: rangeHistory });
	// 		return;
	// 	} else if (type == 'lastN') {
	// 		if (!data.number || typeof data.number != 'number') throw 'filter data needs a number';
	// 		let lastNHistory = await historyData.getAllHistoryByLastN(data.number);
	// 		res.status(200).json({ data: lastNHistory });
	// 		return;
	// 	} else {
	// 		res.status(404).json({ error: 'filter type is incorrect' });
	// 		return;
	// 	}
	// } catch (error) {
	// 	res.status(400).json({ error });
	// }
});

module.exports = router;
