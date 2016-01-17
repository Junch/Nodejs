'use strict';

var router = require('express').Router();
var stockUtil = require('./stockUtil');

var arr = [
  'sh000001','sz399006','sz399001','sh000300','sh000905','hkHSI'
];

router.get('/', function(req, res) {
  stockUtil.getStockArr(arr).then((items)=>{
    var newArr = items.map(function(item, index){
      return {
        title: item.name,
        previous: item.previous,
        price: item.price
      };
    });

    res.setHeader('Cache-Control', 'no-cache');
    res.json(newArr);
  }).catch((err)=>{
    res.status(500).send({error: err.toString()})
  });
});

module.exports = router;
