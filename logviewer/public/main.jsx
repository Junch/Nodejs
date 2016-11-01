import React from 'react';
import ReactDOM from 'react-dom';
import style from './app.css';
import model from './js/demo.js';
import PresencePage from './presence.jsx'
import {getPresences, generateTable, getAllSenders} from './js/presence.js';
import FilterPage from './filter.jsx';
import moment from 'moment';
require("moment-duration-format");

function getStartEndtime(lines) {
  let re = /(\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d,\d\d\d).+/;
  let start = undefined;
  let end = undefined;

  lines.find(line => {
    let result = re.exec(line);
    if (result) {
      start = moment(result[1], moment.ISO_8601);
      return true;
    }
    return false;
  });

  let len = lines.length;
  for (let i=len-1; i >= 0; --i) {
    let result = re.exec(lines[i]);
    if (result) {
      end = moment(result[1], moment.ISO_8601);
      break;
    }
  }

  return {start, end};
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filteredLog: '', titles:[], rows: [], senders: [], deviceInfo:'Device info',
                  summary: 'Summary info'};
    this.totalLines = [];
  }

  saveMergedData(data, filename) {
    let blob = new Blob([data], {type: 'text/plain'});
    let blobURL = URL.createObjectURL(blob);
    let a = document.createElement("a");
    let clickEvent = document.createEvent("MouseEvent");
    clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.href = blobURL;
    a.download = filename;
    a.dispatchEvent(clickEvent);
  }

  handleZipFileChange(e) {
    let file = e.target.files[0];

    model.unzipDeviceInfo(file).then(data => {
      this.setState({deviceInfo: data});
      return model.unzipLogs(file);
    }).then(data => {
      this.totalLines = data.split('\n');
      data = null;
    }).then(() => {
      let {start, end} = getStartEndtime(this.totalLines);
      let during = moment.duration(end-start).format("d[d] h:mm:ss");
      let obj =  {
          lines: this.totalLines.length,
          starttime: start.format(),
          endtime: end.format(),
          during: during};

      let arr = [];
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)){
          if (obj[prop] !== undefined) {
            arr.push(`${prop}: ${obj[prop]}`);
          }
        }
      }
      this.setState({summary: arr.join('\n')});  
      return getPresences(this.totalLines, '');
    }).then(arr => {
      this.setState({senders: getAllSenders(arr), titles: [], rows: []});
    }).catch(err => console.log(err));
  }

  handleFilterChange(e) {
    let re = new RegExp(e.target.value.trim(), "i");
    let filteredLines = [];
    this.totalLines.forEach(line => {
      if (re.test(line)) {
        filteredLines.push(line);
      }
    });
    console.log(`total = ${this.totalLines.length}, left = ${filteredLines.length}`);
    if (filteredLines.length > 5000) {
      this.setState({filteredLog: "The left lines > 5000. Please use more filter"});
    } else {
      this.setState({filteredLog: filteredLines.join('\n')});
    }
  }

  handleDownload(e) {
    let file = this.refs.prtfile.files[0];
    model.unzipLogs(file).then(data => {
      this.saveMergedData(data, file.name + '.log');
      data = null;
    }).catch(err => console.log(err));
  }

  handleSelectSender(e, sender){
    getPresences(this.totalLines, sender).then(arr => {
      let {titles, rows} = generateTable(arr);
      this.setState({titles: titles, rows: rows});
    }).catch(err => console.log(err));
  }

  render() {
    return (
      <div className="container">
        <h1 className="h1">Jabber PRT Viewer</h1>
        <div className="row">
          <div className="col-sm-8">
            <input type="file" className="form-control" accept="application/zip" ref="prtfile" onChange={e => this.handleZipFileChange(e)}/>
          </div>
          <button className="btn btn-default" onClick={e => this.handleDownload(e)}>Download</button>
        </div>

        <div style={{marginTop: "15px"}}>
          <ul className="nav nav-tabs" role="tablist">
            <li role="presentation" className="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Home</a></li>
            <li role="presentation"><a href="#presence" aria-controls="presence" role="tab" data-toggle="tab">Presence</a></li>
            <li role="presentation"><a href="#filter" aria-controls="filter" role="tab" data-toggle="tab">Filter</a></li>
            <li role="presentation"><a href="#others" aria-controls="others" role="tab" data-toggle="tab">Others</a></li>
          </ul>

          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="home">
              <h3>Home</h3>
              <pre>{this.state.deviceInfo}</pre>
              <div>
                <pre>{this.state.summary}</pre>
              </div>
            </div>
            <div role="tabpanel" className="tab-pane" id="presence">
              <PresencePage senders={this.state.senders}  titles={this.state.titles} rows={this.state.rows} handleSelectSender={(e, sender) => this.handleSelectSender(e, sender)} />
            </div>
            <div role="tabpanel" className="tab-pane" id="filter">
              <FilterPage filteredLog={this.state.filteredLog} handleFilterChange={e => this.handleFilterChange(e)} />
            </div>
            <div role="tabpanel" className="tab-pane" id="others">
              <h3>Others</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('content'));
