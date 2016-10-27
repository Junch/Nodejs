import React from 'react';
import ReactDOM from 'react-dom';
import style from './app.css';
import model from './js/demo.js';
import PresencePage from './presence.jsx'
import {getPresences, generateTable, getAllSenders} from './js/presence.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filteredLog: '', titles:[], rows: [], senders: []};
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
    model.unzipBlob(file, data => {
      this.totalLines = data.split('\n');
      data = null;
      getPresences(this.totalLines, '').then(arr => {
        this.setState({senders: getAllSenders(arr), titles: [], rows: []});
      }, err => console.log(err));
    });
  }

  handleFilterChange(e) {
    let re = new RegExp(e.target.value.trim());
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
    model.unzipBlob(file, data => {
      this.saveMergedData(data, file.name + '.log');
      data = null;
    });
  }

  handleSelectSender(e, sender){
    getPresences(this.totalLines, sender).then(arr => {
      let {titles, rows} = generateTable(arr);
      this.setState({titles: titles, rows: rows});
    }, err => console.log(err));
  }

  render() {
    return (
      <div className="container">
        <h1 className={style.h1}>Jabber Log viewer</h1>
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
            </div>
            <div role="tabpanel" className="tab-pane" id="presence">
              <PresencePage senders={this.state.senders}  titles={this.state.titles} rows={this.state.rows} handleSelectSender={(e, sender) => this.handleSelectSender(e, sender)} />
            </div>
            <div role="tabpanel" className="tab-pane" id="filter">
              <h3>Filter</h3>
              <div className="form-horizontal">
                <div className="form-group">
                  <label htmlFor="filter" className="col-sm-2 control-label">Filter</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id="filter" onChange={e => this.handleFilterChange(e)} placeholder="input filter..."/>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <textarea className="col-sm-12 control-label" rows="38" readOnly="readonly"  wrap="off" value={this.state.filteredLog}/>
              </div>
            </div>
            <div role="tabpanel" className="tab-pane" id="others"><h3>Others</h3></div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('content'));
