var connect = require('connect');
var serverStatic = require('serve-static');

var app = connect();

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(serverStatic("../angularjs"));

// https://github.com/senchalabs/connect
// http://code.tutsplus.com/tutorials/meet-the-connect-framework--net-31220
var id = 0;
app.use("/orders", function (req, res, next){
    if (req.method === "POST") {
        console.log(JSON.stringify(req.body));
        res.writeHead(200, {"Content-Type":"application/json"});
        var out = {
            id: ++id
        };
        res.end(JSON.stringify(out));
    } else{
        next();
    }
});

app.listen(5000);
