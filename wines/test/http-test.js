'use strict';  

var request = require('supertest');
var should  = require('should');
var mongoskin = require('mongoskin');
require = require('really-need');

describe('HTTP Endpoint Tests', function() {
    var server;
    var db;

    function populateDB(callback) {
        var wines = [
        {
            name: "CHATEAU DE SAINT COSME",
            year: "2009",
            grapes: "Grenache / Syrah",
            country: "France",
            region: "Southern Rhone",
            description: "The aromas of fruit and spice...",
            picture: "saint_cosme.jpg"
        },
        {
            name: "LAN RIOJA CRIANZA",
            year: "2006",
            grapes: "Tempranillo",
            country: "Spain",
            region: "Rioja",
            description: "A resurgence of interest in boutique vineyards...",
            picture: "lan_rioja.jpg"
        }];

        db.collection('wines').insert(wines, callback);
    };

    beforeEach(function(done){
        db = mongoskin.db('mongodb://localhost:27017/winedb');
        db.collection('wines').drop(function(err, reply){
            populateDB(function(err, reply){
                server = require('../index', {bustCache: true});
                done();
            });
        });
    });

    afterEach(function(done){
        server.close(function(){
            db.close(done);
        });
    })

    it('should return the list of wines', function(done){
        request(server).get('/wines')
        .expect('Content-type',/json/)
        .end(function(err, res){
            if (err) return done(err);
            res.status.should.equal(200);
            res.body.length.should.equal(2);
            done();
        });
    });

    it('should be able to add a wine', function(done){
        var wine = {
            name: "MaoTai",
            year: "2009",
            grapes: "Grenache / Syrah",
            country: "China",
            region: "GuiZhou Province",
            description: "The aromas of fruit and spice...",
            picture: "saint_cosme.jpg"
        };

        request(server).post('/wines')
        .send(wine)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
            if (err) throw err;
            res.body.name.should.equal('MaoTai');
            db.collection('wines').count(function(err, count){
                count.should.equal(3);
                done();
            });
        });
    });

    it('Get an existing wine', function(done){
        db.collection('wines').findOne({}, function(err, item){
            request(server).get('/wines/' + item._id)
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });

    it('Update an existing wine', function(done){
        var wine = {
            name: "MaoTai",
            year: "2009",
            grapes: "Grenache / Syrah",
            country: "China",
            region: "GuiZhou Province",
            description: "The aromas of fruit and spice...",
            picture: "saint_cosme.jpg"
        };

        db.collection('wines').findOne({}, function(err, item){
            request(server).put('/wines/' + item._id)
            .send(wine)
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });

    it('Delete an existing wine', function(done){
        db.collection('wines').findOne({}, function(err, item){
            request(server).delete('/wines/' + item._id)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                // https://www.npmjs.com/package/supertest
                // If you are using the .end() method .expect() assertions that fail will not throw - 
                // they will return the assertion as an error to the .end() callback. In order to fail
                // the test case, you will need to rethrow or pass err to done()
                if (err) throw err; // if (err) return done(err);
                db.collection('wines').count(function(err, count){
                    count.should.equal(1);
                    done();
                });
            });
        });
    });
});