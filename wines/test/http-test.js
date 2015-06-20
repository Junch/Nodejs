'use strict';  

var request = require('supertest');
var should  = require('should');

describe('HTTP Endpoint Tests', function() {  

    it('should return the list of wines', function(done){
        request('http://127.0.0.1:3000')
            .get('/wines')
            .expect('Content-type','app1lication/json')
            .end(function(err, res){
                res.status.should.equal(200);
                res.body.length.should.equal(2);
                done();
            });
    });
});
