'use strict';

var request = require('request');

//
// If the stock is not in trade, its opening,price,max and min are all zero
//

exports.getStock = function(id){
  return new Promise(function(resolve, reject){
    request(`http://hq.sinajs.cn/list=${id}`, function(error, response, body){
      if (error){
        return reject(error);
      }

      if (response.statusCode != 200){
        return reject({error: 'statusCode =' + response.statusCode });
      }

      var arr = body.match(/var hq_str_\w+="(.+)"/);
      if (arr == null || arr.length < 2){
        return reject({error: 'The data from sina is not expected'});
      }

      var elems = arr[1].split(',');

      if (id.startsWith('hk')){
        if (elems.length != 19) {
          return reject({error: 'The data from sina is not expected'});
        }

        var s= {
          id: id,
          name: elems[1],
          opening: Number(elems[2]),
          previous: Number(elems[3]),
          price: Number(elems[6]),
          max: Number(elems[4]),
          min: Number(elems[5]),
          day: new Date(elems[17])
        }

        return resolve(s);

      }else if(id.startsWith('sh') || id.startsWith('sz')){
        if (elems.length != 33){
          return reject({error: 'The data from sina is not expected'});
        }

        var s= {
          id: id,
          name: elems[0],
          opening: Number(elems[1]),
          previous: Number(elems[2]),
          price: Number(elems[3]),
          max: Number(elems[4]),
          min: Number(elems[5]),
          day: new Date(elems[30])
        }

        return resolve(s);
      }

      return reject({error: 'Unsupported stock id'});
    });
  });
}


