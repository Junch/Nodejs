'use strict';

var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;
var logger = require('../utils/logger');

var db;

exports.connect = (next) => {
    if (db == null){
        MongoClient.connect('mongodb://localhost:27017/winedb', {promiseLibrary: Promise}).then((res) => {
            db = res;
            next();
        });
    } else {
        next();
    }
};

exports.findById = (req, res) => {
    var idStr = req.params.id;
    logger.info('Retrievie wine: ' + idStr);

    var id;
    try {
        id = new ObjectID(idStr);
    }catch (err){
        res.status(400).send({error: err.toString()});
        return;
    }

    db.collection('wines').findOne({_id: id}).then((item) => {
        logger.info('Retrievie wine: ' + JSON.stringify(item));
        res.send(item);
    }).catch((err) => res.status(500).send({error: err.toString()}));
};

exports.findAll = (req, res) => {
    db.collection('wines').find().toArray().then((items) => {
        res.send(items);
    }).catch((err) => res.status(500).send({error: err.toString()}));
};

exports.addWine = (req, res) => {
    var wine = req.body;
    logger.info('Add wine: ' +  JSON.stringify(wine));
    db.collection('wines').insert(wine).then((items) => {
        logger.info('Add wine: ' + JSON.stringify(items.ops[0]));
        res.send(items.ops[0]);
    }).catch((err) => res.status(500).send({error: err.toString()}));
};

exports.updateWine = (req, res) => {
    var id = req.params.id;
    var wine = req.body;
    logger.info('Update wine: ' + id + JSON.stringify(wine));
    db.collection('wines').update({_id: new ObjectID(id)}, wine).then((result) => {
        logger.info(String(result) + ' document(s) updated');
        res.send(wine);
    }).catch((err) => res.status(500).send({error: err.toString()}));
};

exports.deleteWine = (req, res) => {
    var id = req.params.id;
    logger.info('Delete wine: ' + id);
    db.collection('wines').remove({_id: new ObjectID(id)}).then((result) => {
        logger.info(String(result) + ' document(s) deleted');
        res.send(req.body);
    }).catch((err) => res.status(500).send({error: err.toString()}));
};
