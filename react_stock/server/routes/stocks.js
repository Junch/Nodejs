'use strict';

var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;
var router = require('express').Router();
var stockUtil = require('./stockUtil');

class Stock {
  findAll (req) {
    return req.db.collection('stocks').find().toArray();
  }

  addStock (req) {
    return req.db.collection('stocks').insert(req.body);
  }
}

let stock = new Stock();

router.get('/', function(req, res) {
  stock.findAll(req).then((stocks) => {
    let arr = stocks.map((item) => {
      return item.symbol.toLowerCase();
    });

    stockUtil.getStockArr(arr).then((items) => {
      let newArr = items.map(function(item, index){
        return {
          symbol: stocks[index].symbol,
          title: item.name,
          previous: item.previous,
          price: item.price,
          volume: stocks[index].volume
        };
      });

      res.setHeader('Cache-Control', 'no-cache');
      res.json(newArr);
    });
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.post('/', (req, res) => {
  stock.addStock(req).then((items)=>{
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
