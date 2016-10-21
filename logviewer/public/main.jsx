import React from 'react';
import ReactDOM from 'react-dom';
import style from './app.css';
import model from './js/demo.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  unzip(zipfile){
    model.getEntries(zipfile, function(entries) {
      let arr = entries.filter(function(entry){
        return entry.filename.match(/jabber\.log/) != null;
      });

      console.log(arr);
    });
  }

  handleZipFileChange() {
    let fileInput = this.refs.fileInput;
    this.unzip(fileInput.files[0]);
  }

  render() {
    return (
      <div>
        <h1 className={style.h1}>Log viewer</h1>
        <div>
          <input type="file" accept="application/zip" ref="fileInput" onChange={e => this.handleZipFileChange(e)}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('content'));
