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
        .expect('Content-type','application/json; charset=utf-8')
        .end(function(err, res){
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
        .end(function(err, res){
            res.status.should.equal(200);
            res.body.name.should.equal('MaoTai');
            db.collection('wines').count(function(err, count){
                count.should.equal(3);
                done();
            });
        });
    });
});