var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

router.get('/ad', function (req, res, next) {
    res.render('ad/ad');
});
module.exports = router;
