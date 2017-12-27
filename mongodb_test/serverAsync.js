// https://stackoverflow.com/questions/47662220/db-collection-is-not-a-function-when-using-mongoclient-v3-0
// In MONGODB NODE.JS DRIVER 3.0, the promise library is no longer needed.
const MongoClient = require('mongodb').MongoClient;

let myClient;

async function printCollections() {
    let client;

    try {
        client = await MongoClient.connect('mongodb://localhost:27017');
        console.log("Connected to mongodb");
        let db = client.db('test');
        let coll = await db.createCollection("orders");
        await coll.insert({
            name: 'tom', age: 20
        });
        const items = await db.collection("orders").find({}).toArray();
        console.log(items);
    }catch(err) {
        console.log(err.stack);
    }

    if (client) {
        client.close();
    }
}

printCollections();
