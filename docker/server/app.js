var path = require('path');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;
var db;

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log("Failed to connect to server");
    } else {
        console.log("Connected to server successfully");
        db = database;
    }
});

app.use(bodyparser.json());
app.use('/', express.static(path.join(__dirname, '../public')));

var insertDocument = function (db, document, callback) {
    // Get the documents collection
    var collection = db.collection('documents');

    // Insert some documents
    collection.insertOne(document, function (err, result) {
        callback(err, JSON.stringify(result.ops[0]));
    });
};

app.post('/hello', function (req, res) {
    var data = req.body;
    insertDocument(db, data, function(err, result) {
        res.status(201).send(result)
    })
});

app.get('/hello', function (req, res) {
    res.send('world');
});

app.listen(3000);