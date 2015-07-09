'use strict';
 
describe('cart factory', function() {
  beforeEach(module('cart'));

  var cart;

  beforeEach(inject(function(_cart_){
    cart = _cart_;
  }));

  it('cart.addProduct: add different products', function() {
    cart.addProduct(23, 'basketball', 10);
    cart.addProduct(24, 'football', 20);
    expect(cart.getProducts().length).toEqual(2);
    expect(cart.getProducts()[0].id).toEqual(23);
    expect(cart.getProducts()[0].name).toEqual('basketball');
    expect(cart.getProducts()[0].price).toEqual(10);
    expect(cart.getProducts()[0].count).toEqual(1);
  });

  it('cart.addProduct: add same products', function() {
    cart.addProduct(23, 'basketball', 10);
    cart.addProduct(23, 'basketball', 10);
    expect(cart.getProducts().length).toEqual(1);
    expect(cart.getProducts()[0].id).toEqual(23);
    expect(cart.getProducts()[0].name).toEqual('basketball');
    expect(cart.getProducts()[0].price).toEqual(10);
    expect(cart.getProducts()[0].count).toEqual(2);
  });

  it('cart.removeProduct', function() {
    cart.addProduct(23, 'basketball', 10);
    cart.addProduct(24, 'football', 20);

    cart.removeProduct(23);
    expect(cart.getProducts().length).toEqual(1);
    expect(cart.getProducts()[0].id).toEqual(24);
  });
});

describe('cart_summary directive', function() {
  beforeEach(module('cart'));

  var cart, controller, scope;

  beforeEach(inject(function(_cart_){
    cart = _cart_;
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    $templateCache.put('components/cart/cartSummary.html', '<template-goes-here />');
    var el = angular.element("<cart-summary></cart-summary>")
    $compile(el)($rootScope.$new());
    $rootScope.$digest();

    scope = el.scope();
  }));

  it("cart.itemCount calculation", function() {
    cart.addProduct(23, 'basketball', 10);
    cart.addProduct(24, 'football', 20);
    expect(scope.itemCount()).toEqual(2);
  });

  it("cart.total is the total price", function() {
    cart.addProduct(23, 'basketball', 10);
    cart.addProduct(24, 'football', 20);
    expect(scope.total()).toEqual(30);
  });
});
