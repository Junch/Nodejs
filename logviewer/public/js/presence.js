'use strict';
var parseString=require('xml2js').parseString;

class Presence {
  constructor(json, time){
    this.from = json.from;
    this.to = json.to;
    this.show = json.show;
    this.priority = json.priority;
    this.time = time;
    this.status = json.status;
    this.type = json.type;

    if (Array.isArray(json.x)){
      let customElem = json.x.find(item=>{
        return item.xmlns == "http://webex.com/connect/customstatus";
      });

      if (customElem){
        this.customstatus = customElem.var;
      }
    }else if(json.x && json.x.xmlns == "http://webex.com/connect/customstatus") {
      this.customstatus = json.x.var;
    }

    let re = /(v=.+&p=.+)/;
    this.node = undefined;
    if (json.c != null) {
      let result = re.exec(json.c.node);
      if (result != null) {
        this.node = result[1];
      }
    }
  }

  description(){
    let obj = {show: this.show,
               priority: this.priority,
               type: this.type,
               status: this.status,
               customstatus: this.customstatus}

    let arr = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)){
        if (obj[prop] !== undefined) {
          arr.push(`${prop}: ${obj[prop]}`);
        }
      }
    }

    return arr.join('\n');
  }
}

function getPresences(lines, from) {
  let str = `Recv:(<presence from=\"${from}.+)`;
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
    
          let time = line.substr(0, 23);
          let elem = new Presence(res.presence, time);
          arr.push(elem);
        });
      }
    });

    resolve(arr);
  });
}

function getAllSenders(arr) {
  let senders = [];
  let re = /(.+)@.+/;
  
  arr.forEach(presence =>{
    let result = re.exec(presence.from);
    if (result && -1 == senders.indexOf(result[1])) {
      senders.push(result[1]);
    }
  });

  return senders.sort();
}

function generateTable(arr){
  let rows = [];
  let titles = ['DateTime'];
  let titlesMore = [''];
  arr.forEach(item => {
    let index = titles.indexOf(item.from);
    if (index == -1) {
      titles.push(item.from);
      titlesMore.push(item.node);
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

  rows.splice(0, 0, titlesMore);
  return({titles, rows});
}

module.exports = {getPresences, generateTable, getAllSenders}
