const crypto = require('crypto');
const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'.split('');

const getHashedPassword = (password) => {
	const sha256 = crypto.createHash('sha256');
	const hash = sha256.update(password).digest('base64');
	return hash;
};

const generateAuthToken = () => {
	return crypto.randomBytes(30).toString('hex');
};

function randomText(len) {
	const result = [];
	for (let i = 0; i < len; i++) result.push(pool[Math.floor(Math.random() * pool.length)]);
	return result.join('');
}


module.exports = { getHashedPassword, generateAuthToken, randomText };
