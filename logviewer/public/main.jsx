import React from 'react';
import ReactDOM from 'react-dom';
import style from './app.css';
import model from './js/demo.js';
import PresencePage from './presence.jsx'
import {getPresences, generateTable, getAllSenders} from './js/presence.js';
import FilterPage from './filter.jsx';
import moment from 'moment';
require("moment-duration-format");
import {search} from './js/search.js'

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

  setSummaryInfo() {
    let {start, end} = getStartEndtime(this.totalLines);
    this.range = {start, end};
    let during = moment.duration(end-start).format("d[d] h:mm:ss");
    let obj =  {
        lines: this.totalLines.length,
        starttime: start.format('YYYY-MM-DD HH:mm:ss,SSS'),
        endtime: end.format('YYYY-MM-DD HH:mm:ss,SSS'),
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
  }

  setSlider() {
    if (this.slider != null) {
      let {start, end} = getStartEndtime(this.totalLines);
      let min = start.valueOf();
      let max = end.valueOf();
      this.slider.setAttribute("tooltip", "always");
      this.slider.setAttribute("min", min);
      this.slider.setAttribute("max", max);
      this.slider.setAttribute("value", [min, max]);
      this.slider.setAttribute("enabled", true);
      this.slider.refresh();
      this.slider.on("change", val => {
        this.range = search(this.totalLines, val.newValue[0], val.newValue[1]);
        this.handleFilterChange();
      });
    }
  }

  readTxtFile(file){
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function(e) {
        let data = e.target.result;
        resolve(data);
      }
      reader.readAsText(file);
    });
  }

  handleZipFileChange(e) {
    let file = e.target.files[0];

    model.unzipDeviceInfo(file).then(data => {
      if (data !== '') {
        this.setState({deviceInfo: data});
      }

      if (file.name.toLowerCase().endsWith('.zip')){
        return model.unzipLogs(file);
      }else{
        return this.readTxtFile(file);
      }
    }).then(data => {
      this.totalLines = data.split('\n');
      data = null;
    }).then(() => {
      this.setSummaryInfo();
      this.setSlider();
      return getPresences(this.totalLines, '');
    }).then(arr => {
      this.setState({senders: getAllSenders(arr), titles: [], rows: []});
    }).catch(err => console.log(err));
  }

  handleFilterChange(e) {
    let re = new RegExp($('#filtertext').val().trim(), "i");
    let lines = this.totalLines.slice(this.range.start, this.range.end);
    let filteredLines = [];
    lines.forEach(line => {
      if (re.test(line)) {
        filteredLines.push(line);
      }
    });
    console.log(`total = ${lines.length}, left = ${filteredLines.length}`);
    if (filteredLines.length > 10000) {
      this.setState({filteredLog: `${filteredLines.length} lines > 10000. Please use more filter`});
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

  componentDidMount() {
    this.slider = new Slider("#timeFilter", {
      min: 1,
      max: 100,
      value: [1, 100],
      tooltip: 'hide',
      enabled: false,
      range: true,
      focus: true,
      formatter: value => {
        if (Array.isArray(value)) {
          let ranges = value.map(item => {
            return moment(item).format('YYYY-MM-DD HH:mm:ss,SSS');
          });
          return ranges.join(', ');
        } else{
          return moment(value).format('YYYY-MM-DD HH:mm:ss,SSS');
        }
      }
    });
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
            <li role="presentation"><a href="#about" aria-controls="about" role="tab" data-toggle="tab">About</a></li>
          </ul>

          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="home">
              <div style={{marginTop: "15px"}}>
                <pre>{this.state.deviceInfo}</pre>
                <pre>{this.state.summary}</pre>
              </div>
            </div>
            <div role="tabpanel" className="tab-pane" id="presence">
              <PresencePage senders={this.state.senders}  titles={this.state.titles} rows={this.state.rows} handleSelectSender={(e, sender) => this.handleSelectSender(e, sender)} />
            </div>
            <div role="tabpanel" className="tab-pane" id="filter">
              <FilterPage filteredLog={this.state.filteredLog} handleFilterChange={e => this.handleFilterChange(e)} />
            </div>
            <div role="tabpanel" className="tab-pane" id="about">
              <div style={{marginTop: "15px"}}>
                <p>The page is maintained by <a href="mailto:juchen3@cisco.com">Jun Chen</a>. Your advice is appreciated.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('content'));
