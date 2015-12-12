'use strict';
var expect = require('chai').expect;
var stock = require('./../stock.js');

describe('Test getStock', () => {
  it('Get price of sh601006', (done) => {
    stock.getStock('sh601006').then(function(data){
      //console.log(data);
      expect(data.opening).to.be.an('Number')
      done();
    }).catch(function(error){
      done(error);
    });
  });

  it('Get price of hk03968', (done) => {
    stock.getStock('hk03968').then(function(data){
      //console.log(data);
      expect(data.opening).to.be.an('Number')
      done();
    }).catch(function(error){
      done(error);
    });
  });

  it('Get price of sz300104', (done) => {
    stock.getStock('sz300104').then(function(data){
      //console.log(data);
      expect(data.opening).to.be.an('Number')
      done();
    }).catch(function(error){
      done(error);
    });
  });
});
