'use strict';

var router = require('express').Router();
var stockUtil = require('./stockUtil');

var stocks = [
  {
    symbol: 'SZ000002',
    volume: 7000
  },
  {
    symbol: 'SH601318',
    volume: 3800
  },
  {
    symbol: 'SH600875',
    volume: 1400
  },
  {
    symbol: 'SH600030',
    volume: 2100
  },
  {
    symbol: 'SH510880',
    volume: 5000
  },
  {
    symbol: 'SH510650',
    volume: 23000
  },{
    symbol: 'HK02202',
    volume: 100
  },{
    symbol: 'HK03333',
    volume: 100
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
