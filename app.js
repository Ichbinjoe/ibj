var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connect_redis = require('connect-redis')(session);
var sass = require('node-sass');

var renderSassFile = (name) => {
    console.log("Prerendering " + name + ".scss..");
    var outFile = path.join(__dirname, 'public/css/' + name + '.css');
    if (fs.existsSync(outFile)) {
        fs.unlinkSync(outFile)
    }
    fs.writeFile(outFile, sass.renderSync({
        file: path.join(__dirname, 'style/build/' + name + '.scss')
    }).css);
};

renderSassFile('md');
renderSassFile('style');


var cfg = require('./config');

var routes = require('./routes/index');

var app = express();
var isDev = app.get('env') === 'development';

if (isDev) {
    console.log("*********DEVELOPMENT MODE*********");
    console.log("Do not run on production systems!")
} else {
    app.set('trust proxy', 1);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('combined'));

app.use('/update', require('./routes/update'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: cfg.session.secret,
    store: isDev ? null : new connect_redis(cfg.session.redis),
    cookie: {
        secure: !isDev
    }
}));

app.use('/',require('./routes/artifacts'));
app.use('/', routes);
app.use('/v', require('./routes/votifier'));
app.use('/p', require('./routes/ping'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (isDev) {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
