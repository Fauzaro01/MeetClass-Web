const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({
        msg: "Hello Dunia",
        code : 200
    })
})

router.get('/account', (req, res)=> {
    if (req.user) {
        res.status(200).send({
            username : req.user.username,
            apikey : req.user.apikey
        })
    } else {
        res.status(401).send({
            msg: "Unauthorized. Please login first."
        });
    }
})

module.exports = router