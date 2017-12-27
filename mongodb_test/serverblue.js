// https://stackoverflow.com/questions/47662220/db-collection-is-not-a-function-when-using-mongoclient-v3-0
// In MONGODB NODE.JS DRIVER 3.0, the promise library bluebird is no longer needed.
const MongoClient = require('mongodb').MongoClient;

let myClient;

MongoClient.connect('mongodb://localhost:27017/test').then( client => {
    console.log("Connected to mongodb");
    myClient = client;
    const db = client.db('test');
    return db.collection("orders").find({}).toArray();
}).then( items => {
    console.log(items);
    myClient.close();
}).catch( err=> {
    console.log(err);
    if (myClient){
        myClient.close();
    }
});
