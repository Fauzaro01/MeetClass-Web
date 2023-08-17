const express = require('express');
const router = express.Router();

// Middleware for debugging :V

router.use('/', (req, res, next) => {
    console.log(`Request received from IP: ${req.ip}`);
    
});

router.get('/', (req, res) => {
    res.status(200).render('index', {
        layout: 'layout/main',
        title: 'MeetClass X PPLG 1',
        page: 'Home',
    });
});

module.exports = router;
e.exports = router;