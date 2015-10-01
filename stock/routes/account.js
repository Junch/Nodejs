var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;

router.get('/', (req, res) => {
  var query = {};
  if (req.query.userid) {
    query.userid = new ObjectID(req.query.userid);
  }

  req.db.collection('accounts').find(query).toArray().then(items => {
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

  req.db.collection('accounts').findOne({_id: id}).then(item => {
    res.send(item);
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.post('/', (req, res) => {
  var account = req.body;

  req.db.collection('accounts').insert(account).then(items => {
    res.send(items.ops[0]);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

router.post('/:id', (req, res) => {
  var id = req.params.id;
  var account = req.body;
  req.db.collection('accounts').update({_id: new ObjectID(id)}, account).then(result => {
    res.send(account);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

router.delete('/:id', (req, res) => {
  var id = req.params.id;
  req.db.collection('accounts').remove({_id: new ObjectID(id)}).then(result => {
    res.send(req.body);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

module.exports = router;
