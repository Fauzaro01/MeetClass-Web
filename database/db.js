const { User } = require('./model/index');

async function addUser(username, password, apikey) {
	const obj = { username, password, apikey, defaultKey: apikey, premium: [], limit: 50 };
	User.create(obj);
}

module.exports.addUser = addUser;

async function checkUsername(username) {
	const users = await User.findOne({ username });
	if (users !== null) {
		return users.username;
	}

	return false;
}

module.exports.checkUsername = checkUsername;

async function getApikey(id) {
	const users = await User.findOne({ _id: id });
	return { apikey: users.apikey, username: users.username };
}

module.exports.getApikey = getApikey;

async function cekKey(apikey) {
	const db = await User.findOne({ apikey });
	if (db === null) {
		return false;
	}

	return db.apikey;
}

module.exports.cekKey = cekKey;

async function cekLimit(apikey) {
	const db = await User.findOne({ apikey });
	if (db === null) {
		return false;
	}

	return db.limit
}

module.exports.cekLimit = cekLimit;
