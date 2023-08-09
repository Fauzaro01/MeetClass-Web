require('dotenv').config();
const debug = require('debug')('MeetClass:server');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send({
        status: 200,
        message: "Hello World!"
    })
})

app.use(function(req, res, next) {
    next(createError(404));
  });
  
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log("[🚀] Server Meluncurr | http://localhost:" + port)
    console.log("[⚒]  Mode: " + app.get('env'))
})


  