var router = require('express').Router();

var request = require('request');
var iplib = require('ip');
var dns = require('dns');

var votifier1 = require('votifier-send').send;
var votifier2 = require('votifier2');


var config = require('../config');

function setUp(req, res, next) {
    res.locals.errors = [];
    res.locals.info = [];
    res.locals.sitekey = config.recaptcha.sitekey;
    res.info = function (s) {
        res.locals.info.push(s);
    };

    res.error = function (s) {
        res.locals.errors.push(s);
    };
    next();
}

router.get('/', setUp, function (req, res) {
    res.render('v/votifier.jade');
});

router.post('/', setUp, function (req, res) {
    if (!req.body.ip || !req.body.method || !req.body.tkn || !req.body.playername) {
        return renderWError('One or more fields were missing information!', res);
    }

    var isv2;
    if (!(req.body.method == 'v1' || req.body.method == 'v2')) {
        return renderWError('Malformed request, did not specify correct method.', res);
    } else {
        isv2 = req.body.method == 'v2';
    }

    var g_response = req.body['g-recaptcha-response'];
    if (!g_response) {
        return renderWError('ReCaptcha was not solved!', res);
    }

    request.post('https://www.google.com/recaptcha/api/siteverify', {
        form: {
            secret: config.recaptcha.secret,
            response: g_response
        }
    }, function (error, response, body) {
        if (error) return renderWError("There was an error verifying your recaptcha!", res);
        var bdy = JSON.parse(body);
        if (!bdy.success) return renderWError("Recaptcha failed!", res);

        if (req.body.playername.length > 16) res.error('Playername cannot be greater than 16 chars!');
        var ipsplit = req.body.ip.split(':');
        var ip;
        var port = 8192;

        var cont = function () {
            if (res.locals.errors.length > 0) {
                return res.render('v/votifier');
            }

            if (isv2) {
                votifier2({
                    host: ip,
                    port: port,
                    token: req.body.tkn,
                    vote: {
                        username: req.body.playername,
                        address: req.ip,
                        timestamp: new Date().getTime(),
                        serviceName: config.votifier.serviceName
                    }
                }, function (err) {
                    if (err) {
                        if (err.message.includes("ECONNREFUSED")) {
                            res.error(ip + " and the port " + port + " rejected the attempt to connect. Make sure votifier is running on this port and it isn't firewalled.");
                        } else if (err.message == 'Not a Votifier v2 protocol server') {
                            res.error(ip + ":" + port + ' is not a NuVotifier v2 port. Use the v1 option to test this server.');
                        } else if (err.message.startsWith('DecoderException: ')) {
                            res.error('The token passed for ' + ip + ":" + port + ' has failed. Make sure your token is right. Remember, the serviceName is ibj.io!');
                        } else if (err.message == 'Socket timeout') {
                            res.error(ip + " and the port " + port + " did not respond. Make sure votifier is running on this port and it isn't firewalled.");
                        } else {
                            res.error("There was an error with votifier: '" + err.message + "'. Please send this error to joe@ibj.io so I can catalog it with quick tips to fix it!")
                        }
                    } else {
                        res.info("Version 2 sent successfully to " + req.body.ip + " for player " + req.body.playername + "!");
                    }
                    res.render('v/votifier');
                })
            } else {
                try {
                    votifier1({
                        key: req.body.tkn,
                        host: ip,
                        port: port,
                        data: {
                            user: req.body.playername,
                            site: config.votifier.serviceName,
                            addr: req.ip
                        }
                    }, function (err) {
                        if (err) {
                            if(err == 'Could not connect to server') {
                                res.error(ip + " and the port " + port + " rejected the attempt to connect. Make sure votifier is running on this port and it isn't firewalled.");
                            } else {
                                res.error("There was an error while sending the vote! Please send the following to joe@ibj.io so I can add helpful info about solving the error: "+err);
                            }
                        } else res.info("Version 1 vote sent to " + req.body.ip + ' for player ' + req.body.playername + "! This DOES NOT mean the vote succeeded! Check the server console to make sure it went through!");
                        res.render('v/votifier');
                    })
                } catch (e) {
                    if (e.message == 'encoding too long') {
                        res.error('The key passed was not a valid public key. Please make sure you are copying the key from your server correctly!');
                        res.render('v/votifier');
                    }
                }
            }

        };

        if (ipsplit.length > 2) {
            res.error("Malformed/illegal IP:Port combo!");
            cont();
        }
        else {
            if (ipsplit.length == 2) {
                port = parseInt(ipsplit[1], 10);
                if (isNaN(port) || port < 1 || port > 65535) {
                    res.error("Port is not valid!");
                }
            }
            ip = ipsplit[0];
            if (!(iplib.isV4Format(ip) || iplib.isV6Format(ip)) && res.locals.errors.length == 0) {
                dns.lookup(ip, function (err, address) {
                    if (err) res.error("Domain name passed could not be resolved!");
                    ip = address;
                    cont();
                })
            } else {
                cont();
            }
        }
    });
});


function renderWError(error, res) {
    res.error(error);
    return res.status(400).render('v/votifier');

}
module.exports = router;