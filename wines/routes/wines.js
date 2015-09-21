'use strict';

var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;
var logger = require('../utils/logger');
var router = require('express').Router();

var db;

class Wine {

    connect (next) {
        if (db == null){
            MongoClient.connect('mongodb://localhost:27017/winedb', {promiseLibrary: Promise}).then((res) => {
                db = res;
                next();
            });
        } else {
            next();
        }
    }

    findById (req, res) {
        let idStr = req.params.id;
        logger.info('Retrievie wine: ' + idStr);

        let id;
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
    }

    findAll (req, res) {
        db.collection('wines').find().toArray().then((items) => {
            res.send(items);
        }).catch((err) => res.status(500).send({error: err.toString()}));
    }

    addWine (req, res) {
        let wine = req.body;
        logger.info('Add wine: ' +  JSON.stringify(wine));
        db.collection('wines').insert(wine).then((items) => {
            logger.info('Add wine: ' + JSON.stringify(items.ops[0]));
            res.send(items.ops[0]);
        }).catch((err) => res.status(500).send({error: err.toString()}));
    }

    updateWine (req, res) {
        let id = req.params.id;
        let wine = req.body;
        logger.info('Update wine: ' + id + JSON.stringify(wine));
        db.collection('wines').update({_id: new ObjectID(id)}, wine).then((result) => {
            logger.info(String(result) + ' document(s) updated');
            res.send(wine);
        }).catch((err) => res.status(500).send({error: err.toString()}));
    }

    deleteWine (req, res) {
        let id = req.params.id;
        logger.info('Delete wine: ' + id);
        db.collection('wines').remove({_id: new ObjectID(id)}).then((result) => {
            logger.info(String(result) + ' document(s) deleted');
            res.send(req.body);
        }).catch((err) => res.status(500).send({error: err.toString()}));
    }
}

let wine = new Wine();

router.use((req, res, next) => wine.connect(next));
router.get('/', wine.findAll);
router.get('/:id', wine.findById);
router.post('/', wine.addWine);
router.post('/:id', wine.updateWine);
router.delete('/:id', wine.deleteWine);

module.exports = router;
