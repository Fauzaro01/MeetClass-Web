const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'layout/auth',
        page: "Sign In"
    })
})

router.post('/login', (req, res) => {
    console.log(req.body)
})

module.exports = router;