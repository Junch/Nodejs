'use strict';
let moment = require('moment');

function binarySearch(ar, el, compare_fn) {
  let m = 0;
  let n = ar.length - 1;
  while (m <= n) {
    let k = (n + m) >> 1;
    let cmp = compare_fn(el, ar, k);
    if (cmp > 0) {
      m = k + 1;
    } else if(cmp < 0) {
      n = k - 1;
    } else {
      return k;
    }
  }
  return -m - 1;
}

function compare_moment(a, ar, k) {
  let re = /(\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d,\d\d\d).+/;
  for (let i=k; i>=0; --i) {
    let result = re.exec(ar[i]);
    if (result) {
      let t = moment(result[1], moment.ISO_8601).valueOf();
      return a - t;
    }       
  }

  for (let i=k+1; i<ar.length; ++i) {
    let result = re.exec(ar[i]);
    if (result) {
      let t = moment(result[1], moment.ISO_8601).valueOf();
      return a - t;
    }    
  }

  throw new Error('Date is not found');
}

module.exports = {binarySearch, compare_moment}
