'use strict';

let request = require('supertest');
let chai = require('chai');
chai.should();
let Promise = require('bluebird');
let MongoClient = require('mongodb');
let ObjectID = MongoClient.ObjectID;
var db_url = process.env.MONGODB_URI;

describe('Trade Tests', () => {
  let server;
  let db;

  let populateDB = () => {
    let cash = [
      { volume:  700,  date: new Date('2016-02-01') },
      { volume:  500,  date: new Date('2016-02-02') },
      { volume: -300,  date: new Date('2016-02-03') }];
    return db.collection('cash').insert(cash);
  };

  before(done => {
    MongoClient.connect(db_url, {promiseLibrary: Promise}).then(res => {
      db = res;
      return db.createCollection('cash');
    }).then(() => done());
  });

  after(done => db.close(done));

  beforeEach(done => {
    db.collection('cash').drop().then(() => {
      return populateDB();
    }).then(() => {
      delete require.cache[require.resolve('../server')];
      server = require('../server');
      done();
    });
  });

  afterEach(done => server.close(done));

  it('should return the list of cashes', done => {
    request(server).get('/api/cash')
    .expect('Content-type', /json/)
    .end((err, res) => {
      if (err) {return done(err); }
      res.status.should.equal(200);
      res.body.length.should.equal(3);
      done();
    });
  });

  it('should be able to add an cash', done => {
    let cash = { volume:  1000,  date: new Date('2016-02-10') };

    request(server).post('/api/cash')
    .send(cash)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      res.body.volume.should.equal(1000);
      db.collection('cash').count().then(count => {
        count.should.equal(4);
        done();
      });
    });
  });
});
