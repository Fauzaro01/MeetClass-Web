const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares');

router.get('/', (req, res) => {
    res.render('index', {
        layout: 'layout/main',
        page: 'Home',
    });
});

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', {
        layout: false,
    });
});

router.get('/mapel', (req, res) => {
    res.render('mapel', {
        layout: 'layout/main',
        page : 'Mata Pelajaran',
    });
});

module.exports = router;
