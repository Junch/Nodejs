'use strict';

var express = require('express');
var path = require('path');
var morgan = require('morgan');

var wine = require('./routes/wines');
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

logger.debug('Overriding \'Express\' logger');
app.use(morgan('combined', {stream: logger.stream}));
app.use(express.static(path.join(__dirname, 'static')));

// Make sure our db is connected
app.use(function (req, res, next) {
    wine.connect(next);
});

app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.post('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

var server = app.listen(3000, () => {
    var port = server.address().port;
    logger.info('Listening on port %s', port);
});

module.exports = server;
