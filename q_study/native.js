'use strict';
var colors = require('colors');

// http://glebbahmutov.com/blog/return-a-promise-for-cleaner-api/
// http://javascriptplayground.com/blog/2015/02/promises/

function mytest(a, b){
  return new Promise(function(resolve, reject){
    if (b != 0){
      resolve(a/b);
    }else{
      reject(new Error('Divider cannot be null'));
    }
  });
};

function usePromise(a, b){
  mytest(a, b).then(function(val){
    console.log(colors.green('value: ' + val));
  }).catch(function(error){
    console.log(colors.red.underline(error));
  });
}

usePromise(15, 3);
usePromise(15, 0);


var fetchData = function() {
  return new Promise(function(resolve, reject){
    setTimeout(function() {
      resolve({
        users: [
          { name: 'Jack', age: 22 },
          { name: 'Tom', age: 21 },
          { name: 'Isaac', age: 21 },
          { name: 'Iain', age: 20 }
        ]
      });
    }, 50);
  });
};

fetchData().then(function(users){
  console.log(JSON.stringify(users).inverse);
});
