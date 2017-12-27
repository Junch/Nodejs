/*
s This example uses the node MongoDB module to connect to the local
* mongodb database on this virtual machine
*
* More here: http://mongodb.github.io/node-mongodb-native/markdown-docs/collections.html
*/

//require node modules (see package.json)

//https://mongodb.github.io/node-mongodb-native/
//https://stackoverflow.com/questions/47662220/db-collection-is-not-a-function-when-using-mongoclient-v3-0

const MongoClient = require('mongodb').MongoClient;

//connect away
MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
    if (err) throw err;
    console.log("Connected to Database");
    let db = client.db("test");

    //create collection
    db.createCollection("testCollection", (err, collection) => {
        if (err) throw err;

        console.log("Created testCollection");
        console.log(collection);
        client.close();
    });
});
