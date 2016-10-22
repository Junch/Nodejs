import React from 'react';
import ReactDOM from 'react-dom';
import style from './app.css';
import model from './js/demo.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {log: ''};
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
      this.setState({log: data});
    });
  }

  render() {
    return (
      <div className="container">
        <h1 className={style.h1}>Jabber Log viewer</h1>
        <div>
          <input type="file" accept="application/zip" onChange={e => this.handleZipFileChange(e)}/>
          <br/>
          <textarea rows="20" cols="200" readOnly="readonly" value={this.state.log}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('content'));
