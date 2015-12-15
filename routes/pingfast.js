var router = require('express').Router();

router.get('/p', (req,res) => {
    res.status(200).send('Pong!')
});

module.exports = router;