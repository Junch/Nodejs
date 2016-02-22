'use strict';

var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;
var router = require('express').Router();
var stockUtil = require('./stockUtil');

class Trade {
  findAll (db) {
    return db.collection('trade').find().toArray();
  }

  addTrade (db, trans) {
    return db.collection('trade').insert(trans);
  }
}

let trade = new Trade();

router.get('/', function(req, res) {
  trade.findAll(req.db).then((trans) => {
    res.json(trans);
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.post('/', (req, res) => {
  let trans = req.body;

  stockUtil.getStock(trans.symbol).then((items) => {
    trans.title = items[0].name;
    trans.date = new Date(trans.date); // Should change the Date string to Date type
    trade.addTrade(req.db, trans).then((items) => {
      res.json(items.ops[0]);
    });
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

module.exports = router;
