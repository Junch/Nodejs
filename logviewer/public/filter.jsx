import React from 'react';
let moment = require('moment');

export default class FilterPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{marginTop: "15px"}}>
        <div className="form-horizontal">
          <div className="form-group">
            <label htmlFor="timeFilter" className="col-sm-2 control-label">Time</label>
            <div className="col-sm-10">
              <div>
                <input id="timeFilter" type="text" className="span2" value="" style={{width: "80%"}} />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="filtertext" className="col-sm-2 control-label">Filter</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="filtertext" onChange={e => this.props.handleFilterChange(e)} placeholder="use regular expression here"/>
            </div>
          </div>
        </div>
        <div className="form-group">
          <textarea className="col-sm-12 control-label" rows="32" readOnly="readonly"  wrap="off" value={this.props.filteredLog}/>
        </div>
      </div>
    );
  }
}
