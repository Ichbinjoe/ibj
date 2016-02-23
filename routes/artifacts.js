var router = require('express').Router();
var client = require('../db');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
var config = require('../config');
var crypto = require('crypto');
var mime = require('mime');
var escape = require('escape-html');

client(function (err, client, done) {
    if (err) {
        throw err;
    }
    client.query("CREATE TABLE IF NOT EXISTS ARTIFACTS (TAG CHAR(4) PRIMARY KEY,CONTENTS BYTEA NOT NULL,NAME TEXT,MIMETYPE TEXT)", function (err) {
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
        client.query("SELECT contents, name, mimetype from artifacts where tag = $1", [afact], function (err, query) {
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
    tag = tag.replace('/\//g', '@');
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

            client.query('INSERT INTO ARTIFACTS (TAG, CONTENTS, NAME, MIMETYPE) VALUES ($1, $2, $3, $4);', [
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
        if (mydat.mimetype.startsWith("image/")) { //image
            var ua = req.headers['user-agent'];
            if (ua == null || ua.includes('Preview') || ua.includes('Bot')) {
                res.end(mydat.contents);
            } else {
                res.render('artifact/image', {source: '/' + afact + '/' + mydat.name, afactid: afact});
            }
        } else if (mydat.mimetype == "application/urlredirect") { //URL Redirect
            res.redirect(mydat.contents.toString());
        } else if (mydat.mimetype.startsWith("text/")) { //Probably text.
            var content = String(mydat.contents);
            content = escape(content).replace(new RegExp("/\r\n|\n/g"),"<br>");
            res.render('artifact/text', {href: '/' + afact + '/'+mydat.name, content: content, afactid: afact});
        } else { //File
            res.redirect('/' + afact + "/" + mydat.name);
        }
    });
});

router.get('/:artifact/:name', (req, res, next) => {
    find(req.params.artifact, next, function (mydat) {
        if (mydat.mimetype != "application/urlredirect" && mydat.name == req.params.name) {
            res.setHeader("Content-Type", mydat.mimetype);
            res.writeHead(200);
            res.end(mydat.contents);
        } else {
            next();
        }
    })
});

router.post('/shorten', upload.fields([{name: 'key', maxCount: 1}, {name: 'url', maxCount: 1}]), (req, res, next) => {
    if (req.body.key != config.uploadkey) {
        return res.sendStatus(403);
    }

    if (!req.body.url) {
        return res.sendStatus(400);
    }

    var redir = function (err, tag) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.status(200).send(tag);
    };

    uploadA("application/urlredirect", new Buffer(req.body.url), null, redir);
});

router.post('/upload', upload.single('data'), (req, res, next) => {
    if (req.body.key != config.uploadkey) {
        return res.sendStatus(403);
    }

    var redir = function (err, tag) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.status(200).send(tag);
    };
    var content, name;
    content = req.file.buffer;
    name = req.file.originalname;

    var type = mime.lookup(name);

    uploadA(type, content, name, redir);
});

module.exports = router;