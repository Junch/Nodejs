'use strict';

var request = require('supertest');
/*eslint-disable no-unused-vars*/
var should = require('should');
/*eslint-disable no-undef*/
require = require('really-need');

var Promise = require('bluebird');
var MongoDB = Promise.promisifyAll(require('mongodb'));
var MongoClient = Promise.promisifyAll(MongoDB.MongoClient);
var ObjectID = MongoDB.ObjectID;

describe('HTTP Endpoint Tests', function () {
    var server;
    var db;

    function populateDB() {
        var wines = [
        {
            name: 'CHATEAU DE SAINT COSME',
            year: '2009',
            grapes: 'Grenache / Syrah',
            country: 'France',
            region: 'Southern Rhone',
            description: 'The aromas of fruit and spice...',
            picture: 'saint_cosme.jpg'
        },
        {
            name: 'LAN RIOJA CRIANZA',
            year: '2006',
            grapes: 'Tempranillo',
            country: 'Spain',
            region: 'Rioja',
            description: 'A resurgence of interest in boutique vineyards...',
            picture: 'lan_rioja.jpg'
        }];

        return db.collection('wines').insertAsync(wines);
    }

    before(function (done) {
        MongoClient.connectAsync('mongodb://localhost:27017/winedb').then(function (res) {
            db = res;
            return db.createCollectionAsync('wines');
        }).then(function () {
            done();
        });
    });

    after(function (done) {
        db.close(done);
    });

    beforeEach(function (done) {
        db.collection('wines').dropAsync().then(function () {
            return populateDB();
        }).then(function () {
            server = require('../index', {bustCache: true});
            done();
        });
    });

    afterEach(function (done) {
        server.close(done);
    });

    it('should return the list of wines', function (done) {
        request(server).get('/wines')
        .expect('Content-type', /json/)
        .end(function (err, res) {
            if (err) {return done(err); }
            res.status.should.equal(200);
            res.body.length.should.equal(2);
            done();
        });
    });

    it('should be able to add a wine', function (done) {
        var wine = {
            name: 'MaoTai',
            year: '2009',
            grapes: 'Grenache / Syrah',
            country: 'China',
            region: 'GuiZhou Province',
            description: 'The aromas of fruit and spice...',
            picture: 'saint_cosme.jpg'
        };

        request(server).post('/wines')
        .send(wine)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) {throw err; }
            res.body.name.should.equal('MaoTai');
            db.collection('wines').countAsync().then(function (count) {
                count.should.equal(3);
                done();
            });
        });
    });

    it('Get an existing wine', function (done) {
        db.collection('wines').findOneAsync().then(function (item) {
            request(server).get('/wines/' + item._id)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {throw err; }
                res.body.should.has.property('_id');
                done();
            });
        });
    });

    it('Get a wine by an invalid id', function (done) {
        request(server).get('/wines/1234')
        .expect('Content-Type', /json/)
        .expect(400, /error/, done);
    });

    it('Get an non-existing wine', function (done) {
        var id = new ObjectID();
        console.log(id);

        request(server).get('/wines/' + id)
        .expect(200)
        .expect('Content-Length', 0)
        .end(done);
    });

    it('Update an existing wine', function (done) {
        var wine = {
            name: 'MaoTai',
            year: '2009',
            grapes: 'Grenache / Syrah',
            country: 'China',
            region: 'GuiZhou Province',
            description: 'The aromas of fruit and spice...',
            picture: 'saint_cosme.jpg'
        };

        db.collection('wines').findOneAsync().then(function (item) {
            request(server).put('/wines/' + item._id)
            .send(wine)
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });

    it('Delete an existing wine', function (done) {
        db.collection('wines').findOneAsync().then(function (item) {
            request(server).delete('/wines/' + item._id)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err) {
                // https://www.npmjs.com/package/supertest
                // If you are using the .end() method .expect() assertions that fail will not throw -
                // they will return the assertion as an error to the .end() callback. In order to fail
                // the test case, you will need to rethrow or pass err to done()
                if (err) {throw err; } // if (err) return done(err);
                db.collection('wines').countAsync().then(function (count) {
                    count.should.equal(1);
                    done();
                });
            });
        });
    });
});