'use strict';
const fs = require('fs');
var getPresences=require('../js/presence.js').getPresences;
var generateTable=require('../js/presence.js').generateTable;
var getAllSenders=require('../js/presence.js').getAllSenders;

let filename = 'mergedtxt.log';
fs.readFile(filename, 'utf8', (err, data) => {
  let lines = data.split('\n');
  getPresences(lines, '').then(arr => {
    console.log(getAllSenders(arr));
    let {titles, rows} = generateTable(arr);
    console.log(titles);
    console.log(rows);
  }, err => {console.log(err);});
});
