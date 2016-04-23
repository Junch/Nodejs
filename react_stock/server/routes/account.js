'use strict';

let Promise = require('bluebird');
let MongoClient = require('mongodb');
let ObjectID = MongoClient.ObjectID;
let router = require('express').Router();

class Account {
  findAll (db) {
    return db.collection('cash').find().sort({date: -1}).toArray();
  }

  addCash (db, cash) {
    return db.collection('cash').insert(cash);
  }

  update(db, cash){
    return db.collection('cash').update({_id: cash._id}, cash);
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
  cash.date = new Date(cash.date); // Should change the Date string to Date type

  account.addCash(req.db, cash).then(items => {
    res.json(items.ops[0]);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

router.post('/:id', (req, res) => {
  let id = req.params.id;
  let cash = req.body;
  cash._id = new ObjectID(id);
  cash.date = new Date(cash.date); // Should change the Date string to Date type

  account.update(req.db, cash).then(() => {
    res.json({});
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;
  account.delete(req.db, id).then(() => {
    res.json({});
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

module.exports = router;
