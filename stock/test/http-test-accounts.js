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

    return db.collection('users').insert(users).then(items => {
      var userid = items.insertedIds[1];
      accounts = accounts.map(item => {
        item.userid = userid;
        return item;
      });

      return db.collection('accounts').insert(accounts);
    });
  };

  before(done => {
    MongoClient.connect('mongodb://localhost:27017/stockdb', {promiseLibrary: Promise}).then(res => {
      db = res;
      return db.createCollection('accounts');
    }).then(() => {
      return db.createCollection('users');
    }).then(() => done());
  });

  after(done => db.close(done));

  beforeEach(done => {
    db.collection('accounts').drop().then(() => {
      return db.collection('users').drop();
    }).then(() => {
      return populateDB();
    }).then(() => {
      server = require('../bin/www', {bustCache: true});
      done();
    });
  });

  afterEach(done => server.close(done));

  it('should return the list of accounts', done => {
    request(server).get('/accounts')
    .expect('Content-type', /json/)
    .end((err, res) => {
      if (err) {return done(err); }
      res.status.should.equal(200);
      res.body.length.should.equal(2);
      done();
    });
  });

  it('Fail to add an account if userid is not correct', done => {
    var account = {
      name: 'hs300',
      userid: new ObjectID()
    };

    request(server).post('/accounts')
    .send(account)
    .expect(500)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {throw err; }
      res.body.should.has.property('error');
      done();
    });
  });

  it('should be able to add an account', done => {
    var account = {
      name: 'hs300',
      userid: ''
    };

    db.collection('users').findOne().then(item => {
      account.userid = item._id;

      request(server).post('/accounts')
      .send(account)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {throw err; }
        res.body.name.should.equal('hs300');
        db.collection('accounts').count().then(count => {
          count.should.equal(3);
          done();
        });
      });
    });
  });

  it('Get an existing account', done => {
    db.collection('accounts').findOne().then(item => {
      request(server).get('/accounts/' + item._id)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {throw err; }
        res.body.should.has.property('_id');
        done();
      });
    });
  });

  it('Get an account by an invalid id', done => {
    request(server).get('/accounts/1234')
    .expect('Content-Type', /json/)
    .expect(400, /error/, done);
  });

  it('Get an non-existing account', done => {
    var id = new ObjectID();

    request(server).get('/accounts/' + id)
    .expect(200)
    .expect('Content-Length', 0)
    .end(done);
  });

  it('Update an existing account', done => {
    var account = {
      name: 'abc',
      userid: '',
    };

    db.collection('accounts').findOne().then(item => {
      request(server).post('/accounts/' + item._id)
      .send(account)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {throw err; }
        res.body.name.should.equal('abc');
        done();
      });
    });
  });

  it('Delete an existing account', done => {
    db.collection('accounts').findOne().then(item => {
      request(server).delete('/accounts/' + item._id)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        // https://www.npmjs.com/package/supertest
        // If you are using the .end() method .expect() assertions that fail will not throw -
        // they will return the assertion as an error to the .end() callback. In order to fail
        // the test case, you will need to rethrow or pass err to done()
        if (err) {throw err; } // if (err) return done(err);
        db.collection('accounts').count().then(count => {
          count.should.equal(1);
          done();
        });
      });
    });
  });

  it('Get all the accounts from a user', done => {
    db.collection('users').findOne().then(item => {
      request(server).get(`/accounts?userid=${item._id}`)
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
