var Promise = require("bluebird");
var MongoDB = Promise.promisifyAll(require("mongodb"));
var MongoClient = Promise.promisifyAll(MongoDB.MongoClient);

var mydb;

MongoClient.connectAsync('mongodb://localhost:27017/test').then(function(db) {
	console.log("Connected to mongodb");
	mydb = db;
    return db.collection("orders").find({}).toArrayAsync();
}).then(function(items) {
    console.log(items);
    mydb.close();
}).catch(function(err) {
    console.log(err);
});

// MongoClient.connectAsync('mongodb://localhost:27017/test').then(function(db) {
// 	console.log("Connected to mongodb");
// 	mydb = db;
//     return db.createCollectionAsync("orders");
// }).then(function(coll) {
// 	console.log("Insert item");
// 	return coll.insertAsync({
// 		name: 'tom',
// 		age: 20
// 	});
// }).then(function(){
// 	mydb.close();
// }).catch(function(err) {
//     console.log(err);
// });
