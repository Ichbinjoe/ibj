var router = require('express').Router();
var child_process = require('child_process');
var config = require('../config');
var crypto = require('crypto');
var buffEq = require('buffer-equal-constant-time');

router.post('/', (req,res) => {
    if(!req.headers['user-agent'].startsWith("GitHub-Hookshot/")) return res.sendStatus(403);

    var buffer = [];
    var bufferLength = 0;

    req.on('data', function (chunk) {
        buffer.push(chunk);
        bufferLength += chunk.length;
    });

    req.on('end', function (chunk) {
        
        if (chunk) {
            buffer.push(chunk);
            bufferLength += chunk.length;
        }

        var rawBody = Buffer.concat(buffer, bufferLength).toString();

        var header = req.headers['x-hub-signature'];
        var split = header.split("=");
        if (split.length != 2) {
            return res.sendStatus(400);
        }

        var sig = new Buffer(split[1]);

        var hmac = crypto.createHmac(split[0], config.github.updateKey);
        var digest = new Buffer(hmac.update(rawBody).digest('hex'));

        if (!buffEq(sig, digest)) {
            return res.sendStatus(403)
        }

        child_process.spawn("sh",["refetch.sh"], {detached: true});
        res.sendStatus(200)
    });
});

module.exports = router;