'use strict';

var request = require('supertest');
/*eslint-disable no-unused-vars*/
var should = require('should');
/*eslint-disable no-undef*/
require = require('really-need');

var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;

describe('HTTP Endpoint Tests', () => {
  var server;
  var db;

  var populateDB = () => {
    var users = [
      {
        name: 'Jun Chen',
        email: 'junchen@sina.com',
        account: ['etf', 'stock']
      }];

    var accounts = [
      {
        name: 'etf',
        userid: '',
      },
      {
        name: 'value',
        userid: ''
      }];

    var trades = [
      {
        accountid: '',
        stockid: 'sz600519',
        name: 'gzmt',
        volumne: 200,
        price: 200,
        date: new Date('2014-10-01T00:00:00.000Z')
      },
      {
        accountid: '',
        stockid: 'sz601318',
        name: 'zgpa',
        volumne: 300,
        price: 100,
        date: new Date('2015-10-01T00:00:00.000Z')
      }
    ];

    return db.collection('users').insert(users).then(items => {
      var userid = items.insertedIds[1];
      accounts = accounts.map(item => {
        item.userid = userid;
        return item;
      });

      return db.collection('accounts').insert(accounts);
    }).then(items => {
      var accountid = items.insertedIds[1];
      trades = trades.map(item => {
        item.accountid = accountid;
        return item;
      });

      return db.collection('trades').insert(trades);
    });
  };

  before(done => {
    MongoClient.connect('mongodb://localhost:27017/stockdb', {promiseLibrary: Promise}).then(res => {
      db = res;
      return db.createCollection('users');
    }).then(() => {
      return db.createCollection('accounts');
    }).then(() => {
      return db.createCollection('trades');
    }).then(() => done());
  });

  after(done => db.close(done));

  beforeEach(done => {
    db.collection('accounts').drop().then(() => {
      return db.collection('trades').drop();
    }).then(() => {
      return populateDB();
    }).then(() => {
      server = require('../bin/www', {bustCache: true});
      done();
    });
  });

  afterEach(done => server.close(done));

  it('should return the list of trades', done => {
    request(server).get('/trades')
    .expect('Content-type', /json/)
    .end((err, res) => {
      if (err) {return done(err); }
      res.status.should.equal(200);
      res.body.length.should.equal(2);
      done();
    });
  });

  it('Fail to add a trade if accountid is not correct', done => {
    var trade = {
      accountid: new ObjectID(),
      stockid: 'sz600000',
      name: 'syzg',
      volumne: 300,
      price: 100,
      date: new Date('2015-10-01T00:00:00.000Z')
    };

    request(server).post('/trades')
    .send(trade)
    .expect(500)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {throw err; }
      res.body.should.has.property('error');
      done();
    });
  });

  it('should be able to add an account', done => {
    var trade = {
      accountid: new ObjectID(),
      stockid: 'sz600000',
      name: 'syzg',
      volumne: 300,
      price: 20,
      date: new Date('2015-10-01T00:00:00.000Z')
    };

    db.collection('accounts').findOne().then(item => {
      trade.accountid = item._id;

      request(server).post('/trades')
      .send(trade)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {throw err; }
        res.body.stockid.should.equal('sz600000');
        db.collection('trades').count().then(count => {
          count.should.equal(3);
          done();
        });
      });
    });
  });

  it('Get an existing trade', done => {
    db.collection('trades').findOne().then(item => {
      request(server).get('/trades/' + item._id)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {throw err; }
        res.body.should.has.property('_id');
        done();
      });
    });
  });

  it('Get a trade by an invalid id', done => {
    request(server).get('/trades/1234')
    .expect('Content-Type', /json/)
    .expect(400, /error/, done);
  });

  it('Get an non-existing trade', done => {
    var id = new ObjectID();

    request(server).get('/trades/' + id)
    .expect(200)
    .expect('Content-Length', 0)
    .end(done);
  });

  it('Update an existing trade', done => {
    var trade = {
      accountid: '',
      stockid: 'sz601318',
      name: 'zgpa',
      volumne: 999,
      price: 100,
      date: new Date('2015-10-01T00:00:00.000Z')
    };

    db.collection('trades').findOne().then(item => {
      request(server).post('/trades/' + item._id)
      .send(trade)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {throw err; }
        res.body.volumne.should.equal(999);
        done();
      });
    });
  });

  it('Delete an existing trade', done => {
    db.collection('trades').findOne().then(item => {
      request(server).delete('/trades/' + item._id)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        // https://www.npmjs.com/package/supertest
        // If you are using the .end() method .expect() assertions that fail will not throw -
        // they will return the assertion as an error to the .end() callback. In order to fail
        // the test case, you will need to rethrow or pass err to done()
        if (err) {throw err; } // if (err) return done(err);
        db.collection('trades').count().then(count => {
          count.should.equal(1);
          done();
        });
      });
    });
  });

  it('Get all the trades from an account', done => {
    db.collection('accounts').findOne().then(item => {
      request(server).get(`/trades?userid=${item._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {throw err; }
        res.body.length.should.equal(2);
        done();
      });
    });
  });
});
