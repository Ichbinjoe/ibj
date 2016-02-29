var router = require('express').Router();
var client = require('../db');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
var config = require('../config');
var crypto = require('crypto');
var mime = require('mime');
var escape = require('escape-html');

const CHUNK_SIZE = 1024 * 1024; // 1 Mb

client(function (err, client, done) {
    if (err) {
        throw err;
    }
    /*client.query("CREATE TABLE IF NOT EXISTS ARTIFACTS (TAG CHAR(4) PRIMARY KEY,CONTENTS BYTEA NOT NULL,NAME TEXT,MIMETYPE TEXT)", function (err) {
     done();
     if (err) throw err;
     });*/
    client.query("CREATE TABLE IF NOT EXISTS ARTIFACT_LOOKUP (TAG CHAR(4) NOT NULL UNIQUE, NAME TEXT NOT NULL, MIMETYPE TEXT NOT NULL, INTERNALID SERIAL UNIQUE, CHUNKS INTEGER, CONTENTLENGTH BIGINT, PRIMARY KEY (TAG, INTERNALID));");
    client.query("CREATE TABLE IF NOT EXISTS ARTIFACT_CHUNKS (INTERNALARTIFACTID SERIAL REFERENCES ARTIFACT_LOOKUP(INTERNALID) ON DELETE CASCADE, CHUNKCOUNT INTEGER, CHUNKDATA BYTEA NOT NULL);");
});

function find(afact, next, cb) {
    if (afact.length != 4) {
        return next();
    }

    client(function (err, client, done) {
        if (err) return next(err);
        client.query("SELECT NAME, MIMETYPE, INTERNALID, CHUNKS, CONTENTLENGTH from ARTIFACT_LOOKUP where TAG = $1", [afact], function (err, query) {
            done();
            if (err) return next(err);
            if (query.rows.length == 0) {
                return next();
            }
            cb(query.rows[0]);
        });
    });
}

function chunkStreamer(internalid, count, next, chunkCb, endCb) {
    client(function (err, client, done) {
        if (err) return next(err);
        function nextPart(part) {
            if (part >= count) {
                done();
                return endCb();
            }
            client.query("SELECT CHUNKDATA FROM ARTIFACT_CHUNKS WHERE INTERNALARTIFACTID = $1 AND CHUNKCOUNT = $2", [internalid, part], function (err, query) {
                if (query.rows.length == 0) {
                    done();
                    return endCb(new Error("Ran out of chunks prematurely."));
                }
                nextPart(part + 1);
                chunkCb(query.rows[0].chunkdata);
            })
        }

        nextPart(0);
    });
}

function uploadA(type, content, name, cb) {
    var hash = crypto.createHash('sha512');
    hash.update(name);
    if (content != null)
        hash.update(content);
    var digest = hash.digest('base64');
    var tag = digest.substr(0, 4);
    tag = tag.replace(/\//g, '@');
    client(function (err, client, done) {
        function ripReq(err) {
            done();
            return cb(err);
        }

        if (err) return ripReq(err);
        client.query('DELETE FROM ARTIFACT_LOOKUP WHERE TAG = $1;', [tag], function (err) {
            if (err) return ripReq(err);

            var expectedChunkSize = content != null ? Math.ceil(content.length / CHUNK_SIZE) : 0;
            client.query('INSERT INTO ARTIFACT_LOOKUP (TAG, NAME, MIMETYPE, CHUNKS, CONTENTLENGTH) VALUES ($1, $2, $3, $4, $5) RETURNING INTERNALID', [
                tag, name, type, expectedChunkSize, content != null ? content.length : 0
            ], function (err, query) {
                if (err) return ripReq(err);
                var internalId = query.rows[0].internalid;

                function finalize(err, chunkSize) {
                    if (err) return ripReq(err);
                    if (chunkSize != expectedChunkSize) {
                        client.query('UPDATE ARTIFACT_LOOKUP SET CHUNKS = $1 WHERE INTERNALID = $2', [chunkSize, internalId], function (err) {
                            done();
                            cb(err, tag);
                        })
                    } else {
                        done();
                        cb(err, tag);
                    }
                }

                if (content == null || content.length == 0) {
                    //No content to begin with, simply finalize.
                    return finalize(null, 0);
                }

                //We now need to recursively insert chunks into the database.
                function insertChunk(remainingData, indx) {
                    var fullsplit = remainingData.length > CHUNK_SIZE;
                    console.log(remainingData);
                    var uploadingChunk = remainingData.slice(0, fullsplit ? CHUNK_SIZE : remainingData.length);
                    client.query('INSERT INTO ARTIFACT_CHUNKS (INTERNALARTIFACTID, CHUNKCOUNT, CHUNKDATA) VALUES ($1, $2, $3)',
                        [internalId, indx, uploadingChunk], function (err) {
                            if (err) ripReq(err);
                            if (fullsplit) {
                                insertChunk(remainingData.slice(CHUNK_SIZE, remainingData.length), ++indx);
                            } else {
                                finalize(err, ++indx);
                            }
                        });
                }

                insertChunk(content, 0);
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
                res.redirect('/' + afact + '/' + mydat.name);
            } else {
                res.render('artifact/image', {source: '/' + afact + '/' + mydat.name, afactid: afact});
            }
        } else if (mydat.mimetype == "application/urlredirect") { //URL Redirect
            res.redirect(mydat.name);
        } else { //File or text
            res.redirect('/' + afact + "/" + mydat.name);
        }
    });
});

router.get('/:artifact/:name', (req, res, next) => {
    find(req.params.artifact, next, function (mydat) {
        if (mydat.mimetype != "application/urlredirect" && mydat.name == req.params.name) {
            res.setHeader("Content-Type", mydat.mimetype);
            res.setHeader("Content-Length", mydat.contentlength);
            res.statusCode = 200;
            chunkStreamer(mydat.internalid, mydat.chunks, next,
                function (chunk) {
                    res.write(chunk);
                }, function (err) {
                    if (err) return next(err);
                    res.end();
                });
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

    uploadA("application/urlredirect", null, req.body.url, redir);
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