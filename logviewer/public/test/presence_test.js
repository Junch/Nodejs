'use strict';

let chai = require('chai');
chai.should();
let moment = require('moment');
require("moment-duration-format");

const fs = require('fs');
var getPresences=require('../js/presence.js').getPresences;
var generateTable=require('../js/presence.js').generateTable;
var getAllSenders=require('../js/presence.js').getAllSenders;

describe('Presence Tests', () => {
  it('Get the presence table', done => {
    let filename = 'mergedtxt.log';
    fs.readFile(filename, 'utf8', (err, data) => {
      let lines = data.split('\n');
      getPresences(lines, '').then(arr => {
        console.log(getAllSenders(arr));
        let {titles, rows} = generateTable(arr);
        console.log(titles);
        console.log(rows[0]);
        done();
      }).catch(err => console.log(err));
    });
  });

  it('Use the moment api', done => {
    let s = moment("2016-10-11 15:17:50,990", moment.ISO_8601);
    s.format().should.equal("2016-10-11T15:17:50+08:00");
    let e = moment("2016-10-11 18:04:55,998", moment.ISO_8601);

    moment.duration(e-s).humanize().should.equal("3 hours");
    moment.duration(e-s).format("h [hrs], m [min]").should.equal("2 hrs, 47 min");
    moment.duration(e-s).format("d[d] h:mm:ss", {trim: false}).should.equal("0d 2:47:05");
    done();
  });

  it('Get the start time', done => {
    let s = "2016-10-11 15:17:50,990 [0xb6fdcbec] [erx/jwcpp/xmppsdk/XmppPresence.cpp(1666)] [csf.jwcpp] [handlePresence] - ";
    let re = /(\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d,\d\d\d).+/;
    let result = re.exec(s);
    if (result) {
      let s = moment(result[1], moment.ISO_8601);
      s.format().should.equal("2016-10-11T15:17:50+08:00");
    }

    done();
  });

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

  function binarySearch2(ar, el, compare_fn) {
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

    throw new Error("Date is not found");
  }

  it('Binary search date test2', () => {
    let ar = ['2016-10-11 15:17:51,188 DEBUG',
              '2016-10-11 15:17:52,196 DEBUG',
              'abcd',
              '2016-10-11 15:17:53,254 DEBUG',
              '2016-10-11 15:17:54,529 INFO',
              '2016-10-11 15:17:56,275 DEBUG'];

    let index = binarySearch2(ar, moment('2016-10-11 15:17:52,196', moment.ISO_8601).valueOf(), compare_moment);
    index.should.equal(2);

    index = binarySearch2(ar, moment('2016-10-11 15:17:53,300', moment.ISO_8601).valueOf(), compare_moment);
    index.should.equal(-5);
  });

  it('Binary search date test3', () => {
    let ar = ['abcd',
              '2016-10-11 15:17:52,196 DEBUG',
              'efgh',
              '2016-10-11 15:17:53,300 INFO',
              'mnop',
              'qrst'];

    let index = binarySearch2(ar, moment('2016-10-11 15:17:52,196', moment.ISO_8601).valueOf(), compare_moment);
    index.should.equal(2);

    index = binarySearch2(ar, moment('2016-10-11 15:17:53,300', moment.ISO_8601).valueOf(), compare_moment);
    index.should.equal(4);
  });
});
