'use strict';
// http://mongodb.github.io/node-mongodb-native/2.0/

var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/winedb';
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log('Connected correctly to server');

    var collection = db.collection('wines');
    collection.find({}).toArray(function (err, records) {
        assert.equal(err, null);

        console.log(records);

        var id = records[0]._id;
        console.log(id);

        collection.findOne({_id: new ObjectID(id)}, function (err, wine) {
            assert.equal(null, err);

            console.log(wine);
            db.close();
        });
    });
});

