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
          { symbol: 'sh600036', volume: 700,  date: date, price: 100, title: '招商银行' },
          { symbol: 'sh600104', volume: 500,  date: date, price: 100, title: '上汽集团' },
          { symbol: 'sh600036', volume: 300,  date: date, price: 200, title: '招商银行' },
          { symbol: 'sh600104', volume: -200, date: date, price: 300, title: '上汽集团' },
          { symbol: 'sh600000', volume: 300,  date: date, price: 200, title: '浦发银行' },
          { symbol: 'sh600000', volume: -300, date: date, price: 300, title: '浦发银行' },
          { symbol: 'hk01988',  volume: 6000, date: date, price: 200, title: '民生银行' }];
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

    it('should return the list of stock after many trades', done => {
        request(server).get('/api/trade/stock')
        .expect('Content-type', /json/)
        .end((err, res) => {
            if (err) {return done(err); }
            res.status.should.equal(200);
            res.body.length.should.equal(3);
            res.body[0].volume.should.equal(1000);
            res.body[1].volume.should.equal(300);
            res.body[2].volume.should.equal(6000);
            done();
        });
    });

    it('should be able to add a trade', done => {
        let date = new Date("2016-01-10T01:00:00+01:00");
        let trade = { symbol: 'sh600005', volume: 1000, date: date, price: 9.80 };

        request(server).post('/api/trade')
        .send(trade)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) {throw err; }
            res.body.title.should.equal('武钢股份');
            db.collection('trade').count().then(count => {
                count.should.equal(8);
                return db.collection('stock').count();
            }).then(count => {
                count.should.equal(4);
                done();
            });
        });
    });
});
