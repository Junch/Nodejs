var router = require('express').Router();

var stocks = [
  {
    symbol: 'SZ000002',
    title: '万科A',
    price: 24.43,
    volume: 7000
  },
  {
    symbol: 'SH601318',
    title: '中国平安',
    price: 36.00,
    volume: 3800
  },
  {
    symbol: 'SH600875',
    title: '东方电气',
    price: 13.63,
    volume: 1400
  },
  {
    symbol: 'SH600030',
    title: '中信证券',
    price: 19.35,
    volume: 2100
  },
  {
    symbol: 'SH510880',
    title: '红利ETF',
    price: 2.853,
    volume: 5000
  },
  {
    symbol: 'SH510650',
    title: '金融行业',
    price: 1.549,
    volume: 23000
  }];

router.get('/', function(req, res) {
  res.setHeader('Cache-Control', 'no-cache');
  res.json(stocks);
});

module.exports = router;
