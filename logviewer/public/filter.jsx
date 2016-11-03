import React from 'react';
let moment = require('moment');

export default class FilterPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let slider = new Slider("#timeFilter", {
      formatter: value => {
        if (Array.isArray(value)) {
          let ranges = value.map(item => {
            return moment(item).format();
          });
          return ranges.join(', ');
        } else{
          return value;
        }
      },
      tooltip: 'always',
      range: true
    });

    slider.on("slide", slideEvt => {
      this.props.handleFilterSliderChange(slideEvt);
    });
  }

  render() {
    return (
      <div>
        <h3>Filter</h3>
        <div className="form-horizontal">
          <div className="form-group">
            <label htmlFor="timeFilter" className="col-sm-2 control-label">Span</label>
            <div className="col-sm-10">
              <div>
                <input id="timeFilter" type="text" className="span2" value="" data-slider-min={this.props.start} data-slider-tooltip="show" data-slider-max={this.props.end} data-slider-step="5" style={{width: "80%"}} data-slider-value={`[${this.props.start}, ${this.props.end}]`} />
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
