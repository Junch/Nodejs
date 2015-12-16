'use strict';
var expect = require('chai').expect;
var stock = require('./../stock.js');

describe('Test getStock', () => {
  it('Get price of sh601006', (done) => {
    stock.getStock('sh601006').then(function(data){
      //console.log(data);
      expect(data.opening).to.be.an('Number');
      expect(data.name).to.be.equal('大秦铁路');
      done();
    }).catch(function(error){
      done(error);
    });
  });

  it('Get price of hk03968', (done) => {
    stock.getStock('hk03968').then(function(data){
      //console.log(data);
      expect(data.opening).to.be.an('Number');
      expect(data.name).to.be.equal('招商银行');
      done();
    }).catch(function(error){
      done(error);
    });
  });

  it('Get price of sz300104', (done) => {
    stock.getStock('sz300104').then(function(data){
      //console.log(data);
      expect(data.opening).to.be.an('Number');
      expect(data.name).to.be.equal('乐视网');
      done();
    }).catch(function(error){
      done(error);
    });
  });
});

describe('Test getStockArr', () => {
  it('Get price of sh601006, sz300104', (done) => {
    var arr = [ 'sh601006', 'sz300104'];
    stock.getStockArr(arr).then(function(data){
      //console.log(data);
      expect(data.length).to.be.equal(2);
      expect(data[0].name).to.be.equal('大秦铁路');
      expect(data[1].name).to.be.equal('乐视网');
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
