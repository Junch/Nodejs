'use strict';

var express = require('express');
var wine = require('./routes/wines');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Listening on port %s', port);
});

module.exports = server;
