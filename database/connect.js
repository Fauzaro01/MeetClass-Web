const mongoose = require('mongoose');

function connectMongoDb() {
	mongoose.connect(process.env.MONGOURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	if (process.env.NODE_ENV === 'development') {
		db.on('reconnect', () => {
		console.log('Reconnecting To MongoDB <🔄>')
		});
	} 
	db.once('open', () => {
		console.log('[🚀] MongoDB has Ready to use!');
	});
}

module.exports.connectMongoDb = connectMongoDb;