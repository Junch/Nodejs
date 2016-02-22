'use strict';

var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;
var router = require('express').Router();
var stockUtil = require('./stockUtil');

class Trade {
  findAll (req) {
    return req.db.collection('trade').find().toArray();
  }

  add (req) {
    return req.db.collection('trade').insert(req.body);
  }
}

let trade = new Trade();

router.get('/', function(req, res) {
  trade.findAll(req).then((trade) => {
    let arr = trade.map((item) => {
      return item.symbol.toLowerCase();
    });

    stockUtil.getStockArr(arr).then((items) => {
      let newArr = items.map(function(item, index){
        return {
          symbol: trade[index].symbol,
          title: item.name,
          previous: item.previous,
          price: item.price,
          volume: trade[index].volume
        };
      });

      res.setHeader('Cache-Control', 'no-cache');
      res.json(newArr);
    });
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.post('/', (req, res) => {
  trade.add(req).then((items)=>{
    let st = items.ops[0];

    stockUtil.getStock(st.symbol.toLowerCase()).then((items) => {
      let newArr = items.map(function(item, index){
        return {
          symbol: st.symbol,
          title: item.name,
          previous: item.previous,
          price: item.price,
          volume: st.volume
        };
      });

      res.setHeader('Cache-Control', 'no-cache');
      res.json(newArr);
    });
  });
});

module.exports = router;
