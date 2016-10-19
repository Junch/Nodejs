var React = require('react');
var ReactDOM = require('react-dom');
var style = require('./app.css');
var zip = require('zip-js/WebContent/zip.js');

ReactDOM.render(
  <div>
    <h1 className={style.h1}>Log viewer</h1>
    <div>
      <input type="file" />
    </div>
  </div>,
  document.getElementById('content')
);
