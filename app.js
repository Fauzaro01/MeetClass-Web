require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const createError = require('http-errors');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');
const logger = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const { connectMongoDb } = require('./database/connect');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
connectMongoDb();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(
    rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 1500,
        message: 'Oops too many requests',
    })
);
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 86400000 },
        store: new MemoryStore({
            checkPeriod: 86400000,
        }),
    })
);
app.use(logger('dev'));
app.use(compression());
app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public', { cacheControl: false, maxAge: 86400000 }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

app.get('/test', (req, res) => {
    res.status(200).send({
        message: 'ok',
        status: 200,
    });
});

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

require('./lib/wshandler')(io)
server.listen(process.env.PORT, () => {
    console.log('[🚀] Server Meluncurr | http://localhost:' + process.env.PORT);
    console.log('[🔨] Mode: ' + app.get('env'));
});
