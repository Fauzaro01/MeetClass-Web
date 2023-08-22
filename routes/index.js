const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        layout: 'layout/main',
        title: 'MeetClass X PPLG 1',
        page: 'Home',
    });
});

module.exports = router;
