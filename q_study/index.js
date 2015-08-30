'use strict';

var Q = require('q');

// http://stackoverflow.com/questions/25389597/whats-difference-between-q-nfcall-and-q-fcall

function mytest(cb){
  console.log("In mytest");
  cb(null, 'aaa');
}

// Q expects that mytest calls passed callback with (error, value) and Q then calls your next callback with value. 

Q.nfcall(mytest)
.then(
  function(value){
    console.log(value);
  }
);
