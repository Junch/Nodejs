var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;

router.get('/', (req, res) => {
  req.db.collection('users').find().toArray().then(items => {
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

  req.db.collection('users').findOne({_id: id}).then(item => {
    res.send(item);
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.post('/', (req, res) => {
  var user = req.body;
  req.db.collection('users').insert(user).then(items => {
    res.send(items.ops[0]);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

router.post('/:id', (req, res) => {
  var id = req.params.id;
  var user = req.body;
  req.db.collection('users').update({_id: new ObjectID(id)}, user).then(result => {
    res.send(user);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

router.delete('/:id', (req, res) => {
  var id = req.params.id;
  req.db.collection('users').remove({_id: new ObjectID(id)}).then(result => {
    res.send(req.body);
  }).catch(err => res.status(500).send({error: err.toString()}));
});

module.exports = router;
