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

let filename = 'presence.txt';
fs.readFile(filename, 'utf8', (err, data) => {
  let lines = data.split('\n');
  getPresences(lines, '').then(arr => {
    console.log(arr);
  });
});
