'use strict';

var request = require('request');
var iconv = require('iconv-lite');
//
// If the stock is not in trade, its opening,price,max and min are all zero
//

function parseString(stockString, callback) {
  let arr = stockString.match(/var hq_str_(\w+)="(.+)"/);
  if (arr == null || arr.length != 3){
    return callback({error: 'The data from sina is not expected'});
  }

  let id = arr[1];
  let elems = arr[2].split(',');

  if (id.startsWith('hk')){
    if (elems.length != 19) {
      return callback({error: 'The data from sina is not expected'});
    }

    let s= {
      id: id,
      name: elems[1],
      opening: Number(elems[2]),
      previous: Number(elems[3]),
      price: Number(elems[6]),
      max: Number(elems[4]),
      min: Number(elems[5]),
      day: new Date(elems[17])
    }

    return callback(null, s);

  }else if(id.startsWith('sh') || id.startsWith('sz')){
    if (elems.length != 33){
      return callback({error: 'The data from sina is not expected'});
    }

    let s= {
      id: id,
      name: elems[0],
      opening: Number(elems[1]),
      previous: Number(elems[2]),
      price: Number(elems[3]),
      max: Number(elems[4]),
      min: Number(elems[5]),
      day: new Date(elems[30])
    }

    if (s.opening == 0){
      s.price = s.previous;
    }

    return callback(null, s);
  }

  return callback({error: 'Unsupported stock id'});
}

function getStock(stockids){
  return new Promise(function(resolve, reject){
    request({
      url: `http://hq.sinajs.cn/list=${stockids}`,
      encoding: null}, function(error, response, body){
        if (error){
          return reject(error);
        }

        if (response.statusCode != 200){
          return reject({error: 'statusCode =' + response.statusCode });
        }

        let bodyDecoded = iconv.decode(body, 'gb2312');
        let arrStocks = bodyDecoded.split(';');
        arrStocks.pop();
        let arrReturn = [];

        arrStocks.forEach((stockSz)=>{
          parseString(stockSz, function(err, res){
            if (err == null) {
              arrReturn.push(res);
            }
          });
        });

        return resolve(arrReturn);
    });
  });
}

function getStockArr(stockArr){
  let stockids = stockArr.join(',');
  return getStock(stockids);
}

module.exports = {
  getStock,
  getStockArr
};
