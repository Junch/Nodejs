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
      },
      {
        name: 'John Smith',
        email: 'john@yahoo.com',
        account: ['A50', 'Value']
      }];

    return db.collection('users').insert(users);
  };

  before(done => {
    MongoClient.connect('mongodb://localhost:27017/stockdb', {promiseLibrary: Promise}).then(res => {
      db = res;
      return db.createCollection('users');
    }).then(() => done());
  });

  after(done => db.close(done));

  beforeEach(done => {
    db.collection('users').drop().then(() => {
      return populateDB();
    }).then(() => {
      server = require('../bin/www', {bustCache: true});
      done();
    });
  });

  afterEach(done => server.close(done));

  it('should return the list of users', done => {
    request(server).get('/users')
    .expect('Content-type', /json/)
    .end((err, res) => {
      if (err) {return done(err); }
      res.status.should.equal(200);
      res.body.length.should.equal(2);
      done();
    });
  });

  it('should be able to add a user', done => {
    var user = {
      name: 'Tom Clause',
      email: 'tom@gmail.com',
      account: ['etf', 'stock']
    };

    request(server).post('/users')
    .send(user)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {throw err; }
      res.body.name.should.equal('Tom Clause');
      db.collection('users').count().then(count => {
        count.should.equal(3);
        done();
      });
    });
  });

  it('Get an existing user', done => {
    db.collection('users').findOne().then(item => {
      request(server).get('/users/' + item._id)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {throw err; }
        res.body.should.has.property('_id');
        done();
      });
    });
  });

  it('Get a wine by an invalid id', done => {
    request(server).get('/users/1234')
    .expect('Content-Type', /json/)
    .expect(400, /error/, done);
  });

  it('Get an non-existing user', done => {
    var id = new ObjectID();

    request(server).get('/users/' + id)
    .expect(200)
    .expect('Content-Length', 0)
    .end(done);
  });

  it('Update an existing user', done => {
    var user = {
      name: 'Jun Chen',
      email: 'test@gmail.com',
      account: ['etf300', 'stock']
    };

    db.collection('users').findOne().then(item => {
      request(server).post('/users/' + item._id)
      .send(user)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {throw err; }
        res.body.email.should.equal('test@gmail.com');
        done();
      });
    });
  });

  it('Delete an existing user', done => {
    db.collection('users').findOne().then(item => {
      request(server).delete('/users/' + item._id)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        // https://www.npmjs.com/package/supertest
        // If you are using the .end() method .expect() assertions that fail will not throw -
        // they will return the assertion as an error to the .end() callback. In order to fail
        // the test case, you will need to rethrow or pass err to done()
        if (err) {throw err; } // if (err) return done(err);
        db.collection('users').count().then(count => {
          count.should.equal(1);
          done();
        });
      });
    });
  });
});
