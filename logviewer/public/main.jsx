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

  handleZipFileChange() {
    let fileInput = this.refs.fileInput;
    let file = fileInput.files[0];
    model.unzipBlob(file, data => {
      let blob = new Blob([data], {type: 'text/plain'});
      let blobURL = URL.createObjectURL(blob);
      let a = document.createElement("a");
      let clickEvent = document.createEvent("MouseEvent");
      clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.href = blobURL;
      a.download = file.name + '.log';
      a.dispatchEvent(clickEvent);
    });
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
