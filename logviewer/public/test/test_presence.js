'use strict';
var parseString=require('xml2js').parseString;
const fs = require('fs');

class Presence {
  constructor(json, time){
    this.from = json.from;
    this.to = json.to;
    this.show = json.show;
    this.priority = json.priority;
    this.node = json.c.node;
    this.time = time;
  }

  description(){
    let show = this.show;
    if (this.show == undefined) {
      show = `available`;
    }
    return `show: ${show}<br>priority: ${this.priority}`;
  }
}

function getPresences(lines, from) {
  let str = `Recv:(<presence from=\"${from}.+>.+<\/presence>)`;
  console.log(str);
  let re = new RegExp(str);
  return new Promise((resolve, reject) => {
    let arr = [];
    lines.forEach(line => {
      let result = re.exec(line);
      if (result) {
        let xml = result[1];
        parseString(xml, {mergeAttrs: true, explicitArray: false}, (err, res) => {
          if (err) {
            return reject(err);
          }
    
          if (res.presence.type == null) {
            let time = line.substr(0, 23);
            let elem = new Presence(res.presence, time);
            arr.push(elem);
          }
        });
      }
    });
    resolve(arr);
  });
}

function generateTable(arr){
  let rows = [];
  let titles = ['DateTime'];
  arr.forEach(item => {
    let index = titles.indexOf(item.from);  
    if (index == -1) {
      titles.push(item.from);
      rows.forEach(row => {
        row.push('');
      });

      index = titles.length - 1;
    }

    let newArr = new Array(titles.length);
    newArr.fill('');
    newArr[0] = item.time;
    newArr[index] = item.description();
    rows.push(newArr);
  });

  return({titles, rows});
}

let filename = 'mergedtxt.log';
fs.readFile(filename, 'utf8', (err, data) => {
  let lines = data.split('\n');
  getPresences(lines, 'runzli').then(arr => {
    let {titles, rows} = generateTable(arr);
    console.log(titles);
    console.log(rows);
  });
});
