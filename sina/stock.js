'use strict';

var request = require('request');

exports.getStock = function(id){
  return new Promise(function(resolve, reject){
    request('http://hq.sinajs.cn/list=' + id, function(error, response, body){
      if (error){
        return reject(error);
      }

      if (response.statusCode != 200){
        return reject({error: 'statusCode =' + response.statusCode });
      }

      var elems = body.split(",");
      if (elems.length != 33){
        return reject({error: 'The data from sina is not expected'});
      }

      var s= {
        opening: Number(elems[1]),
        price: Number(elems[3]),
        max: Number(elems[4]),
        min: Number(elems[5])
      }

      resolve(s);
    });
  });
}


