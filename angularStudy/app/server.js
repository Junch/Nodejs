var connect = require('connect');
var serverStatic = require('serve-static');

var app = connect();

app.use(serverStatic(__dirname + "/../angularjs"));
app.listen(process.env.PORT || 5000);
