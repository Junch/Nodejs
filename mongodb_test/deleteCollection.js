// This is called by package.json post-install script to clean the database

// run first: npm start 
// run second: npm run postinstall

var MongoClient = require('mongodb').MongoClient;

//connect away
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
	if(err) throw err;

  	db.dropCollection("testCollection", function() {
  		db.close();
  	});
});
