'use strict';
 
describe('cart factory', function() {
  beforeEach(module('cart'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));