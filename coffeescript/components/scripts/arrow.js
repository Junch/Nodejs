var A, fn, x,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

A = (function() {
  function A(msg) {
    this.msg = msg;
    this.fat = __bind(this.fat, this);
  }

  A.prototype.thin = function() {
    return console.log(this.msg);
  };

  A.prototype.fat = function() {
    return console.log(this.msg);
  };

  return A;

})();

x = new A("yo");

x.thin();

x.fat();

fn = function(callback) {
  return callback();
};

fn(x.thin);

fn(x.fat);

fn(function() {
  return x.thin();
});
