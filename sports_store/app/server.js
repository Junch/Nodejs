var connect = require('connect');
var serverStatic = require('serve-static');

var app = connect();

app.use(serverStatic("../angularjs"));
app.listen(5000);
