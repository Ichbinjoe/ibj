var pg = require('pg');
var config = require('./config');

var connString = "postgres://"+config.db.username+":"+config.db.password+"@"+config.db.host+"/"+config.db.database;

module.exports = function(cb){
    pg.connect(connString, cb);
};