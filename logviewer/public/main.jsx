import React from 'react';
import ReactDOM from 'react-dom';
import style from './app.css';
import model from './js/demo.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filteredLog: ''};
  }

  componentDidMount(){
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
      //this.saveMergedData(data, file.name + '.log');
      this.totalLines = data.split('\n');
    });
  }

  handleFilterChange(e) {
    let re = new RegExp(e.target.value.trim());
    if (re === '') {
      return;
    }
    let filteredLines = [];
    this.totalLines.forEach(line => {
      if (re.test(line)) {
        filteredLines.push(line);
      }
    });
    console.log(`total = ${this.totalLines.length}, left = ${filteredLines.length}`);
    this.setState({filteredLog: filteredLines.join('\n')});
  }

  render() {
    return (
      <div className="container">
        <h1 className={style.h1}>Jabber Log viewer</h1>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="prtfile" className="col-sm-2 control-label">PRT File</label>
            <div className="col-sm-10">
              <input type="file" accept="application/zip" id="prtfile" onChange={e => this.handleZipFileChange(e)}/>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="filter" className="col-sm-2 control-label">Filter</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="filter" onChange={e => this.handleFilterChange(e)} placeholder="input filter..."/>
            </div>
          </div>
          <div className="form-group">
            <button className="btn btn-primary col-sm-2">Confirm</button>
          </div>
        </form>
        <div className="form-group">
          <textarea rows="20" cols="200" readOnly="readonly" value={this.state.filteredLog}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('content'));
