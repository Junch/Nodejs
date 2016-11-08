'use strict';

let chai = require('chai');
chai.should();
let moment = require('moment');
require("moment-duration-format");

const fs = require('fs');
let getPresences=require('../js/presence.js').getPresences;
let generateTable=require('../js/presence.js').generateTable;
let getAllSenders=require('../js/presence.js').getAllSenders;

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
});
