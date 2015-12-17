var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var FileStreamRotator = require('file-stream-rotator');

var sass = require('node-sass');

var renderSassFile = (name) => {
    console.log("Prerendering "+name+".scss..");
    var outFile = path.join(__dirname,'public/css/'+name+'.css');
    if(fs.existsSync(outFile)){
        fs.unlinkSync(outFile)
    }
    fs.writeFile(outFile,sass.renderSync({
        file: path.join(__dirname, 'style/build/'+name+'.scss')
    }).css);
};

renderSassFile('md');
renderSassFile('style');


var cfg = require('./config');

var routes = require('./routes/index');

var app = express();

app.use(require('./routes/pingfast'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


var logDirectory = cfg.logDir;

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
    filename: logDirectory + '/access-%DATE%.log',
    frequency: '7d',
    verbose: false
});

app.use(logger('combined', {stream: accessLogStream}));

app.use('/update', require('./routes/update'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/v', require('./routes/votifier'));
app.use('/ping', require('./routes/ping'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
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
