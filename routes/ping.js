var router = require('express').Router();

router.get('/', (req,res) => {
    res.render('ping/ping')
});

module.exports = router;