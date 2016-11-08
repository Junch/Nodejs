'use strict';

let chai = require('chai');
chai.should();
let moment = require('moment');
let binarySearch=require('../js/search.js').binarySearch;
let compare_moment=require('../js/search.js').compare_moment;

describe('Search Simple Tests', () => {
  // http://stackoverflow.com/questions/22697936/binary-search-in-javascript
  function binarySearch(ar, el, compare_fn) {
    let m = 0;
    let n = ar.length - 1;
    while (m <= n) {
      let k = (n + m) >> 1;
      let cmp = compare_fn(el, ar[k]);
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

  it('Binary search test', () => {
    let ar = [1, 2, 2, 2, 5, 9, 11, 12, 12, 12, 12, 15, 20, 20, 20, 25, 40, 41];

    function compare_number(a, b) {
      return a - b;
    }

    let index = binarySearch(ar, 5, compare_number);   
    index.should.equal(4);
    index = binarySearch(ar, 13, compare_number);   
    index.should.equal(-12);
    index = binarySearch(ar, 12, compare_number);   
    index.should.equal(8);
  });

  it('Binary search date test', () => {
    let ar = ['2016-10-11 15:17:51,188 DEBUG',
              '2016-10-11 15:17:52,196 DEBUG',
              '2016-10-11 15:17:53,254 DEBUG',
              '2016-10-11 15:17:54,529 INFO',
              '2016-10-11 15:17:56,275 DEBUG'];

    function compare_moment(a, b) {
      let re = /(\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d,\d\d\d).+/;
      let result = re.exec(b);
      let t = moment(result[1], moment.ISO_8601).valueOf();
      return a - t;
    }

    let index = binarySearch(ar, moment('2016-10-11 15:17:52,196', moment.ISO_8601).valueOf(), compare_moment);
    index.should.equal(1);

    index = binarySearch(ar, moment('2016-10-11 15:17:52,300', moment.ISO_8601).valueOf(), compare_moment);
    index.should.equal(-3);
  });
});

describe('Search Tests with invalid date format', () => {
  it('Binary search date test1', () => {
    let ar = ['2016-10-11 15:17:51,188 DEBUG',
              '2016-10-11 15:17:52,196 DEBUG',
              'abcd',
              '2016-10-11 15:17:53,254 DEBUG',
              '2016-10-11 15:17:54,529 INFO',
              '2016-10-11 15:17:56,275 DEBUG'];

    let index = binarySearch(ar, moment('2016-10-11 15:17:52,196', moment.ISO_8601).valueOf(), compare_moment);
    index.should.equal(2);

    index = binarySearch(ar, moment('2016-10-11 15:17:53,300', moment.ISO_8601).valueOf(), compare_moment);
    index.should.equal(-5);
  });

  it('Binary search date test2', () => {
    let ar = ['abcd',
              '2016-10-11 15:17:52,196 DEBUG',
              'efgh',
              '2016-10-11 15:17:53,300 INFO',
              'mnop',
              'qrst'];

    let index = binarySearch(ar, moment('2016-10-11 15:17:52,196', moment.ISO_8601).valueOf(), compare_moment);
    index.should.equal(2);

    index = binarySearch(ar, moment('2016-10-11 15:17:53,300', moment.ISO_8601).valueOf(), compare_moment);
    index.should.equal(4);
  });
});
