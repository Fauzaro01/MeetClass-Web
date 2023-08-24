require('dotenv').config();
const debug = require('debug')('MeetClass:server');
const createError = require('http-errors');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { connectMongoDb } = require('./database/connect');

const app = express();
const port = 3000;
connectMongoDb();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 1500,
	message: 'Oops too many requests',
}))
app.use(logger('dev'));
app.use(compression());
app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

app.get('/test', (req, res) => {
    res.status(200).send({
        message: "ok",
        status: 200
    })
})

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { layout: false });
});

app.listen(port, () => {
    console.log('[🚀] Server Meluncurr | http://localhost:' + port);
    console.log('[🔨] Mode: ' + app.get('env'));
});
