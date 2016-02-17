'use strict';

var router = require('express').Router();
var stockUtil = require('./stockUtil');

var stocks = [
  {
    symbol: 'SH600036',
    volume: 700
  },
  {
    symbol: 'SH600104',
    volume: 500
  },
  {
    symbol: 'SH601668',
    volume: 6000
  },
  {
    symbol: 'SH601318',
    volume: 3000
  },
  {
    symbol: 'SH601985',
    volume: 1500
  },
  {
    symbol: 'SH510900',
    volume: 109000
  },
  {
    symbol: 'HK00939',
    volume: 9000
  },
  {
    symbol: 'HK01988',
    volume: 6000
  },
  {
    symbol: 'HK03968',
    volume: 3000
  }];

router.get('/', function(req, res) {
  var arr = stocks.map((item)=>{
    return item.symbol.toLowerCase();
  });

  stockUtil.getStockArr(arr).then((items)=>{
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
  }).catch((err)=>{
    res.status(500).send({error: err.toString()})
  });
});

module.exports = router;
