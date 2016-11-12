'use strict';
let moment = require('moment');

function binarySearch(ar, el, compare_fn = compare_moment) {
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

function getTime(ar, k) {
  let re = /(\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d,\d\d\d).+/;
 
  for (let i=k; i>=0; --i) {
    let result = re.exec(ar[i]);
    if (result) {
      let t = moment(result[1], moment.ISO_8601).valueOf();
      return t;
    }       
  }

  for (let i=k+1; i<ar.length; ++i) {
    let result = re.exec(ar[i]);
    if (result) {
      let t = moment(result[1], moment.ISO_8601).valueOf();
      return t - 1;
    }    
  }

  throw new Error('Date is not found');
}

function compare_moment(a, ar, k) {
  let t = getTime(ar, k);
  return a - t;
}

function searchStart(ar, start) {
  let index = binarySearch(ar, start, compare_moment);
  if (index < 0) {
    return -index-1;
  }

  let i = index;
  for (; i >=0; --i) {
    let t = getTime(ar, i);
    if (t < start) {
      break;
    }
  }

  return i+1;
}

function searchEnd(ar, end) {
  let index = binarySearch(ar, end, compare_moment);
  if (index < 0) {
    return -index-1;
  }

  let i = index;
  for (; i < ar.length; ++i) {
    let t = getTime(ar, i);
    if (t > end) {
      break;
    }
  }

  return i;
}

function search(ar, start, end) {
  let sIndex = searchStart(ar, start);
  let eIndex = searchEnd(ar, end);
  return {sIndex, eIndex};
}

module.exports = {binarySearch, searchStart, searchEnd, search}
