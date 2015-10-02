var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;

router.get('/', (req, res) => {
  var query = {};
  if (req.query.accountid) {
    query.accountid = new ObjectID(req.query.accountid);
  }

  req.db.collection('trades').find(query).toArray().then(items => {
    res.send(items);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

router.get('/:id', (req, res) => {
  var idStr = req.params.id;
  var id;
  try {
    id = new ObjectID(idStr);
  }catch (err){
    res.status(400).send({error: err.toString()});
    return;
  }

  req.db.collection('trades').findOne({_id: id}).then(item => {
    res.send(item);
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.post('/', (req, res) => {
  var trade = req.body;

  req.db.collection('accounts').findOne({_id: new ObjectID(trade.accountid)}).then(item => {
    if (item == null) {
      throw new Error(`account ${trade.accountid} is not found`);
    }

    return req.db.collection('trades').insert(trade);
  }).then(items => {
    res.send(items.ops[0]);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

router.post('/:id', (req, res) => {
  var id = req.params.id;
  var trade = req.body;
  req.db.collection('trades').update({_id: new ObjectID(id)}, trade).then(result => {
    res.send(trade);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

router.delete('/:id', (req, res) => {
  var id = req.params.id;
  req.db.collection('trades').remove({_id: new ObjectID(id)}).then(result => {
    res.send(req.body);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

module.exports = router;
