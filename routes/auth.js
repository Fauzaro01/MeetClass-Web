const express = require('express');
const router = express.Router();

// Middleware for debugging :V

router.use('/', (req, res, next) => {
    console.log(`Request received from IP: ${req.ip}`);
    next();
});

router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'layout/auth',
        page: 'Sign In',
    });
});

router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'layout/auth',
        page: 'Register',
    });
});

router.post('/login', (req, res) => {
    console.log(req.body);
});

module.exports = router;
