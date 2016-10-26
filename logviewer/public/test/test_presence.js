'use strict';
const fs = require('fs');
var getPresences=require('../js/presence.js').getPresences;
var generateTable=require('../js/presence.js').generateTable;

let filename = 'mergedtxt.log';
fs.readFile(filename, 'utf8', (err, data) => {
  let lines = data.split('\n');
  getPresences(lines, 'runzli').then(arr => {
    let {titles, rows} = generateTable(arr);
    console.log(titles);
    console.log(rows);
  });
});
