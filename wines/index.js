'use strict';

var express = require('express');
var path = require('path');
var morgan = require('morgan');

var wines = require('./routes/wines');
var logger = require('./utils/logger');

var app = express();

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var Promise = require('bluebird');
var MongoClient = require('mongodb');
var db;

app.use(function (req, res, next) {
    if (db == null){
        MongoClient.connect('mongodb://localhost:27017/winedb', {promiseLibrary: Promise}).then((res) => {
            db = res;
            req.db = db;
            next();
        });
    } else {
        req.db = db;
        next();
    }
});

logger.debug('Overriding \'Express\' logger');
app.use(morgan('combined', {stream: logger.stream}));
app.use(express.static(path.join(__dirname, 'static')));

app.use('/wines', wines);

var server = app.listen(3000, () => {
    var port = server.address().port;
    logger.info('Listening on port %s', port);
});

module.exports = server;
