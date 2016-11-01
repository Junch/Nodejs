import React from 'react';
let moment = require('moment');

export default class FilterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {start: moment("2016-10-11 15:17:50,990", moment.ISO_8601).valueOf(),
                    end: moment("2016-10-11 18:04:55,998", moment.ISO_8601).valueOf()};
  }

  componentDidMount() {
    $("#ex2").slider({
      formatter: function(value) {
        if (Array.isArray(value)) {
          let ranges = value.map(item => {
            return moment(item).format();
          });
          return ranges.join(', ');
        } else{
          return value;
        }
      }
    });
  }

  render() {
    return (
      <div>
        <h3>Filter</h3>
        <div className="form-horizontal">
          <div className="form-group">
            <label htmlFor="ex2" className="col-sm-2 control-label">Span</label>
            <div className="col-sm-10">
              <div>
                <input id="ex2" type="text" className="span2" value="" data-slider-min={this.state.start} data-slider-tooltip="show" data-slider-max={this.state.end} data-slider-step="5" style={{width: "80%"}} data-slider-value="[1476170270990, 1476180295998]" />
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
