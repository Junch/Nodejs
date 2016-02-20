'use strict';

var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;
var router = require('express').Router();
var stockUtil = require('./stockUtil');

class Stock {
  findAll(req) {
    return req.db.collection('stocks').find().toArray();
  }
}

let stock = new Stock();

router.get('/', function(req, res) {
  stock.findAll(req).then((stocks) => {
    var arr = stocks.map((item) => {
      return item.symbol.toLowerCase();
    });

    stockUtil.getStockArr(arr).then((items) => {
      var newArr = items.map(function(item, index){
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
  }).catch((err) => {
    res.status(500).send({error: err.toString()})
  });
});

module.exports = router;
