var router = require('express').Router();
var client = require('../db');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
var config = require('../config');
var crypto = require('crypto');

client(function (err, client, done) {
    if (err) {
        throw err;
    }
    client.query("CREATE TABLE IF NOT EXISTS ARTIFACTS (TAG CHAR(4) PRIMARY KEY,CONTENTS BYTEA NOT NULL,NAME TEXT,DTYPE INT)", function (err) {
        done();
        if (err) throw err;
    });
});

function find(afact, next, cb) {
    if (afact.length != 4) {
        return next();
    }

    client(function (err, client, done) {
        if (err) return next(err);
        client.query("SELECT contents, name, dtype from artifacts where tag = $1", [afact], function (err, query) {
            done();
            if (err) return next(err);
            if (query.rows.length == 0) {
                return next();
            }
            cb(query.rows[0]);
        });
    });
}

function uploadA(type, content, name, cb) {
    var hash = crypto.createHash('sha512');
    hash.update(content);
    var digest = hash.digest('base64');
    var tag = digest.substr(0, 4);
    client(function (err, client, done) {
        if (err) {
            done();
            return cb(err);
        }
        client.query('DELETE FROM ARTIFACTS WHERE TAG = $1;', [tag], function (err) {
            if (err) {
                done();
                return cb(err);
            }

            client.query('INSERT INTO ARTIFACTS (TAG, CONTENTS, NAME, DTYPE) VALUES ($1, $2, $3, $4);', [
                tag, content, name, type
            ], function (err) {
                done();
                cb(err, tag);
            })
        })

    })
}

router.get('/:artifact', (req, res, next) => {
    var afact = req.params.artifact;
    find(afact, next, function (mydat) {
        if (mydat.dtype == 0) { //image
            var ua = res.headers['user-agent'];
            if (ua.contains('Preview') || ua.contains('Bot')) {
                res.end(mydat.contents);
            } else {
                res.render('artifact/image', {source: '/' + afact + '/' + mydat.name});
            }
        } else if (mydat.dtype == 1) { //File
            res.redirect('/' + afact + "/" + mydat.name);
        } else if (mydat.dtype == 3) { //URL Redirect
            res.redirect(mydat.contents.toString());
        } else { //Probably text.
            res.render('artifact/text', {href: '/' + afact + '/raw', content: String(mydat.contents)});
        }
    });
});

router.get('/:artifact/:name', (req, res, next) => {
    find(req.params.artifact, next, function (mydat) {
        if (mydat.dtype == 0 || mydat.dtype == 1) {
            if (mydat.name == req.params.name) {
                res.end(mydat.contents);
            } else {
                next();
            }
        } else if (mydat.dtype == 2) {
            if (req.params.name == "raw") {
                res.end(mydat.contents);
            } else {
                next();
            }
        } else {
            next();
        }
    })
});

router.get('/shorten', (req, res, next) => {
    if (req.headers.key != config.uploadkey) {
        return res.sendStatus(403);
    }

    if (!req.query.url) {
        return res.sendStatus(400);
    }

    var redir = function (err, tag) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.status(200).json({tag: tag});
    };

    uploadA(3, new Buffer(req.query.url), null, redir);
});

router.post('/upload', upload.single('data'), (req, res, next) => {
    if (req.body.key != config.uploadkey) {
        return res.sendStatus(403);
    }

    if (!req.body.dtype || req.body.dtype < 0 || req.body.dtype > 2) {
        return res.sendStatus(400);
    }
    var redir = function (err, tag) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.status(200).json({tag: tag});
    };
    var content, name;
    content = req.file.buffer;
    if (req.body.dtype < 2) {
        name = req.file.originalname;
    } else {
        name = null;
    }
    uploadA(req.body.dtype, content, name, redir);
});

module.exports = router;