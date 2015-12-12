'use strict';
var expect = require('chai').expect;
var stock = require('./../stock.js');

describe('Test getStock', function(){
  it('Get price of sh601006', function(done){
    stock.getStock('sh601006').then(function(data){
      //console.log(data);
      expect(data.opening).to.be.an('Number')
      done();
    }).catch(function(error){
      done(error);
    });
  });
});
