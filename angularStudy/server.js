var connect = require('connect');
var serverStatic = require('serve-static');

var app = connect();

app.use(serverStatic("app"));

var server = app.listen(process.env.PORT || 5000, function() {
    console.log('Listening on port %s', server.address().port);
});
