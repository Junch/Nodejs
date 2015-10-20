var Promise = require("bluebird");
var MongoClient = require('mongodb');

var mydb;

MongoClient.connect('mongodb://localhost:27017/test', {promiseLibrary: Promise}).then(function(db) {
	console.log("Connected to mongodb");
	mydb = db;
    return db.collection("hotbucket").find({}).toArray();
}).then(function(items) {
    console.log(items);
    mydb.close();
}).catch(function(err) {
    console.log(err);
});
