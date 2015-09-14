'use strict';

var Promise = require('bluebird');
var MongoDB = Promise.promisifyAll(require('mongodb'));
var MongoClient = Promise.promisifyAll(MongoDB.MongoClient);
var ObjectID = MongoDB.ObjectID;
var db;

exports.connect = (next) => {
    if (db == null){
        MongoClient.connectAsync('mongodb://localhost:27017/winedb').then((res) => {
            db = res;
            next();
        });
    } else {
        next();
    }
};

exports.findById = (req, res) => {
    var idStr = req.params.id;
    console.log('Retrieving wine: ' + idStr);

    var id;
    try {
        id = new ObjectID(idStr);
    }catch (err){
        res.status(400);
        res.send({error: err.toString()});
        return;
    }

    db.collection('wines').findOneAsync({_id: id}).then((item) => {
        res.send(item);
    });
};

exports.findAll = function (req, res) {
    db.collection('wines').find().toArrayAsync().then((items) => {
        res.send(items);
    }).catch((err) => {
        res.send({error: 'An error has occurred - ' + err});
    });
};

exports.addWine = function (req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('wines').insertAsync(wine).then((items) => {
        console.log('Success: ' + JSON.stringify(items.ops[0]));
        res.send(items.ops[0]);
    }).catch((err) => {
        res.send({error: 'An error has occurred' + err});
    });
};

exports.updateWine = function (req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    if (wine._id) {
        delete wine._id;
    }
    db.collection('wines').updateAsync({_id: new ObjectID(id)}, wine).then((result) => {
        console.log(String(result) + ' document(s) updated');
        res.send(wine);
    }).catch((err) => {
        console.log('Error updating wine: ' + err);
        res.send({error: 'An error has occurred'});
    });
};

exports.deleteWine = function (req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('wines').removeAsync({_id: new ObjectID(id)}).then((result) => {
        console.log(String(result) + ' document(s) deleted');
        res.send(req.body);
    }).catch((err) => {
        res.send({error: 'An error has occurred - ' + err});
    });
};
