var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

router.get('/ad', function (req, res, next) {
    res.render('ad/ad');
});

router.get('/2fa', function (req, res, next) {
    res.render('2fa/2fa');
});

router.get('/robots.txt', (req, res) => {
    res.status(200).send("User-agent: * \n Disallow: ")
});
module.exports = router;
