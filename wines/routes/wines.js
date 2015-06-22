'use strict';

var mongoskin = require('mongoskin');
var ObjectID = mongoskin.ObjectID;
var db = mongoskin.db('mongodb://localhost:27017/winedb', {safe: true});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
    db.collection('wines').findOne({'_id': new ObjectID(id)}, function(err, item) {
        if (err) {throw err; }
        res.send(item);
    });
};

exports.findAll = function(req, res) {
    db.collection('wines').find().toArray(function(err, items) {
        if (err) {throw err; }
        res.send(items);
    });
};

exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('wines').insert(wine, function(err, items) {
        if (err) {
            res.send({'error': 'An error has occurred'});
        } else {
            console.log('Success: ' + JSON.stringify(items[0]));
            res.send(items[0]);
        }
    });
};

exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('wines').update({'_id': new ObjectID(id)}, wine, function(err, result) {
        if (err) {
            console.log('Error updating wine: ' + err);
            res.send({'error': 'An error has occurred'});
        } else {
            console.log('' + result + ' document(s) updated');
            res.send(wine);
        }
    });
};

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('wines').remove({'_id': new ObjectID(id)}, function(err, result) {
        if (err) {
            res.send({'error': 'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};
