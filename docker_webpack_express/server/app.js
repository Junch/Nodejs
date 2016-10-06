var path = require('path');
var express = require('express');
var app = express();

if(process.env.NODE_ENV !== 'production') {
    require('../webpackdev.server')(app)
}

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/hello', function (req, res) {
    res.send('world');
});

var port = process.env.PORT || 9090;
app.listen(port);
