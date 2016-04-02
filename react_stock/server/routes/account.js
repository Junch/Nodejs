'use strict';

let Promise = require('bluebird');
let MongoClient = require('mongodb');
let ObjectID = MongoClient.ObjectID;
let router = require('express').Router();

class Account {
  findAll (db) {
    return db.collection('cash').find().toArray();
  }

  addCash (db, cash) {
    return db.collection('cash').insert(cash);
  }

  delete(db, id) {
    return db.collection('cash').remove({_id: new ObjectID(id)});
  }
}

let account = new Account();
router.get('/', (req, res) => {
  account.findAll(req.db).then(cashes => {
    res.json(cashes);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

router.post('/', (req, res) => {
  let cash = req.body;
  account.addCash(req.db, cash).then(items => {
    res.json(items.ops[0]);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;
  account.delete(req.db, id).then(() => {
    res.json({});
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

module.exports = router;
