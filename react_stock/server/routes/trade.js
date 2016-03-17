'use strict';

var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;
var router = require('express').Router();
var stockUtil = require('./stockUtil');

class Trade {
  findAll (db, date) {
    if (date == null) {
      date = new Date();
    }
    return db.collection('trade').find({date: {$lte: date}}).toArray();
  }

  find (db, symbol) {
    return db.collection('trade').find({symbol: symbol}).toArray();
  }

  addTrade (db, trans) {
    return db.collection('trade').insert(trans);
  }

  delete(db, id) {
    return db.collection('trade').remove({_id: new ObjectID(id)});
  }

  getStockFromTrade(db, date) {
    return new Promise((resolve, reject) => {
      this.findAll(db, date).then(trans => {
        var m = new Map();
        trans.forEach(item => {
          let elem = m.get(item.symbol);
          if (!elem) {
            m.set(item.symbol, {
              symbol: item.symbol,
              volume: item.volume,
              title: item.title
            });
          } else {
            let newVolume = elem.volume + item.volume;
            if (newVolume == 0) {
              m.delete(item.symbol);
            } else {
              elem.volume = newVolume;
              m.set(item.symbol, elem);
            }
          }
        });

        let stocks = [];
        for (let value of m.values()) {
          stocks.push(value);
        }

        return resolve(stocks);
      });
    });
  }

  cacheStock(db) {
    return new Promise((resolve, reject) => {
      this.getStockFromTrade(db, new Date()).then(stocks => {
        db.collection('stock').remove({}).then(() => {
          if (stocks.length == 0) {
            return resolve({});
          }

          return db.collection('stock').insert(stocks);
        }).then(WriteResult => {
          return resolve(WriteResult);
        });
      });
    });
  }
}

let trade = new Trade();

router.get('/stock', (req, res) => {
  trade.getStockFromTrade(req.db, new Date()).then(stocks => {
    res.json(stocks);
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.get('/stock/:date', (req, res) => {
  let date = new Date(req.params.date);
  trade.getStockFromTrade(req.db, date).then(stocks => {
    res.json(stocks);
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.get('/', (req, res) => {
  trade.findAll(req.db).then((trans) => {
    res.json(trans);
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.get('/:symbol', (req, res) => {
  trade.find(req.db, req.params.symbol).then(stocks => {
    res.json(stocks);
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;
  trade.delete(req.db, id).then(() => {
    return trade.cacheStock(req.db);
  }).then(() => {
    res.json({});
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

router.post('/', (req, res) => {
  let trans = req.body;

  stockUtil.getStock(trans.symbol).then(items => {
    trans.title = items[0].name;
    trans.date = new Date(trans.date); // Should change the Date string to Date type
    trade.addTrade(req.db, trans).then(items => {
      trade.cacheStock(req.db).then(()=>{
        res.json(items.ops[0]);
      });
    });
  }).catch((err) => res.status(500).send({error: err.toString()}));
});

module.exports = router;
