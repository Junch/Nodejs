'use strict';

var request = require('supertest');
var chai = require('chai');
chai.should();
var Promise = require('bluebird');
var MongoClient = require('mongodb');
var ObjectID = MongoClient.ObjectID;

describe('HTTP Endpoint Tests', () => {
    var server;
    var db;

    var populateDB = () => {
        var stocks = [
          { symbol: 'SH600036', volume: 700 },
          { symbol: 'SH600104', volume: 500 },
          { symbol: 'SH601668', volume: 6000 },
          { symbol: 'SH601318', volume: 3000 },
          { symbol: 'SH601985', volume: 1500 },
          { symbol: 'SH510900', volume: 109000 },
          { symbol: 'HK00939',  volume: 9000 },
          { symbol: 'HK01988',  volume: 6000 },
          { symbol: 'HK03968',  volume: 3000 }];
        return db.collection('stocks').insert(stocks);
    };

    before(done => {
        MongoClient.connect('mongodb://localhost:27017/stockdb', {promiseLibrary: Promise}).then((res) => {
            db = res;
            return db.createCollection('stocks');
        }).then(() => done());
    });

    after(done => db.close(done));

    beforeEach(done => {
        db.collection('stocks').drop().then(() => {
            return populateDB();
        }).then(() => {
            delete require.cache[require.resolve('../server')];
            server = require('../server');
            done();
        });
    });

    afterEach(done => server.close(done));

    it('should return the list of stocks', done => {
        request(server).get('/api/stocks')
        .expect('Content-type', /json/)
        .end((err, res) => {
            if (err) {return done(err); }
            res.status.should.equal(200);
            res.body.length.should.equal(9);
            done();
        });
    });

    it('should be able to add a stock', done => {
        var stock = { symbol: 'SH600000', volume: 1000 };

        request(server).post('/api/stocks')
        .send(stock)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {throw err; }
            //res.body.name.should.equal('MaoTai');
            db.collection('stocks').count().then(count => {
                count.should.equal(10);
                done();
            });
        });
    });
});
