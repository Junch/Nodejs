'use strict';

import Promise from 'bluebird';
import MongoClient from 'mongodb';
var ObjectID = MongoClient.ObjectID;
import logger from '../utils/logger';
import { Router } from 'express';

class Wine {

    findById (req, res) {
        let idStr = req.params.id;
        logger.info(`Retrievie wine: ${idStr}`);

        let id;
        try {
            id = new ObjectID(idStr);
        }catch (err){
            res.status(400).send({error: err.toString()});
            return;
        }

        req.db.collection('wines').findOne({_id: id}).then((item) => {
            logger.info('Retrievie wine: ' + JSON.stringify(item));
            res.send(item);
        }).catch((err) => res.status(500).send({error: err.toString()}));
    }

    findAll (req, res) {
        req.db.collection('wines').find().toArray().then((items) => {
            res.send(items);
        }).catch((err) => res.status(500).send({error: err.toString()}));
    }

    addWine (req, res) {
        let wine = req.body;
        logger.info(`Add wine: ${JSON.stringify(wine)}`);
        req.db.collection('wines').insert(wine).then((items) => {
            logger.info('Add wine: ' + JSON.stringify(items.ops[0]));
            res.send(items.ops[0]);
        }).catch((err) => res.status(500).send({error: err.toString()}));
    }

    updateWine (req, res) {
        let id = req.params.id;
        let wine = req.body;
        wine._id = new ObjectID(id);
        logger.info(`Update wine: ${id} ${JSON.stringify(wine)}`);

        req.db.collection('wines').update({_id: wine._id}, wine).then((result) => {
            logger.info(String(result) + ' document(s) updated');
            res.send(wine);
        }).catch((err) => res.status(500).send({error: err.toString()}));
    }

    deleteWine (req, res) {
        let id = req.params.id;
        logger.info(`Delete wine: ${id}`);
        req.db.collection('wines').remove({_id: new ObjectID(id)}).then((result) => {
            logger.info(String(result) + ' document(s) deleted');
            res.send(req.body);
        }).catch((err) => res.status(500).send({error: err.toString()}));
    }
}

let wine = new Wine();
var router = Router();

router.get('/', (req, res) => wine.findAll(req, res));
router.get('/:id', (req, res) => wine.findById(req, res));
router.post('/', (req, res) => wine.addWine(req, res));
router.post('/:id', (req, res) => wine.updateWine(req, res));
router.delete('/:id', (req, res) => wine.deleteWine(req, res));

export default router;
