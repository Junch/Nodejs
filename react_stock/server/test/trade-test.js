'use strict';

let request = require('supertest');
let chai = require('chai');
chai.should();
let Promise = require('bluebird');
let MongoClient = require('mongodb');
let ObjectID = MongoClient.ObjectID;

describe('Trade Tests', () => {
    let server;
    let db;

    let populateDB = () => {
        let date = new Date("2016-01-10T01:00:00+01:00");

        let trade = [
          { symbol: 'SH600036', volume: 700,  date: date, price: 100 },
          { symbol: 'SH600104', volume: 500,  date: date, price: 100 },
          { symbol: 'SH600036', volume: 300,  date: date, price: 200 },
          { symbol: 'SH600104', volume: -200, date: date, price: 300 },
          { symbol: 'SH600000', volume: 300,  date: date, price: 200 },
          { symbol: 'SH600000', volume: -300, date: date, price: 300 },
          { symbol: 'HK01988',  volume: 6000, date: date, price: 200 }];
        return db.collection('trade').insert(trade);
    };

    before(done => {
        MongoClient.connect('mongodb://localhost:27017/stockdb', {promiseLibrary: Promise}).then((res) => {
            db = res;
            return db.createCollection('trade');
        }).then(() => done());
    });

    after(done => db.close(done));

    beforeEach(done => {
        db.collection('trade').drop().then(() => {
            return populateDB();
        }).then(() => {
            delete require.cache[require.resolve('../server')];
            server = require('../server');
            done();
        });
    });

    afterEach(done => server.close(done));

    it('should return the list of trade', done => {
        request(server).get('/api/trade')
        .expect('Content-type', /json/)
        .end((err, res) => {
            if (err) {return done(err); }
            res.status.should.equal(200);
            res.body.length.should.equal(7);
            done();
        });
    });

    it('should be able to add a trade', done => {
        let date = new Date("2016-01-10T01:00:00+01:00");
        let trade = { symbol: 'SH600001', volume: 1000, date: date, price: 9.80 };

        request(server).post('/api/trade')
        .send(trade)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {throw err; }
            db.collection('trade').count().then(count => {
                count.should.equal(8);
                done();
            });
        });
    });
});
