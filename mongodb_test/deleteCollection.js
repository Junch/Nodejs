// This is called by package.json post-install script to clean the database

// run first: npm start 
// run second: npm run postinstall

const MongoClient = require('mongodb').MongoClient;

//connect away
MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
    if(err) throw err;
    let db = client.db('test');

    db.dropCollection("orders").then(()=>{
        console.log("test/orders dropped");
        client.close();
    }).catch(err=>{
        console.log(err);
        client.close();
    });
});
