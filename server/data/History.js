const mongoCollections = require('./dbCollections');
const History = mongoCollections.History;
const { ObjectId, Timestamp } = require('mongodb');

module.exports = {
	async addHistory(data) {
		if (!data) throw 'Invalid data';

		const HistoryCollection = await History();
		const insertInfo = await HistoryCollection.insertOne(data);
		if (insertInfo.insertedCount === 0) throw 'IP data could not be added';
		const newID = insertInfo.insertedId;
		let AddedHistory = await this.getHistoryById(newID);
		//add timestamp field and update
		Object.assign(AddedHistory, { TimeStamp: new Date(ObjectId(newID).getTimestamp()) });
		const updatedInfo = await HistoryCollection.findOneAndUpdate(
			{ _id: ObjectId(newID) },
			{ $set: AddedHistory },
			{ returnOriginal: false }
		);
		if (updatedInfo == null) throw 'update listing fail';
		return updatedInfo.value;
	},

	async getAllHistoryByDateRange(start, end) {
		const HistoryCollection = await History();
		const HistoryList = await HistoryCollection.find({
			TimeStamp: {
				$gte: new Date(start + 'T00:00:00.000+00:00'),
				$lte: new Date(end + 'T23:59:59.000+00:00')
			}
		}).toArray();
		return HistoryList;
	},

	async getAllHistoryByLastN(number) {
		const HistoryCollection = await History();
		const HistoryList = await HistoryCollection.find({}, { sort: { _id: -1 }, limit: number }).toArray();
		return HistoryList;
	},

	async getHistoryById(id) {
		if (!id || id === undefined) throw 'You must provide an ID';
		const HistoryCollection = await History();
		const historyfound = await HistoryCollection.findOne({ _id: id });
		if (historyfound === null) throw 'history not found';
		return historyfound;
	},

	async getAllHistory() {
		const HistoryCollection = await History();
		const HistoryList = await HistoryCollection.find({}).toArray();
		return HistoryList;
	}
};
