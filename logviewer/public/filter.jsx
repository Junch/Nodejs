import React from 'react';

export default class FilterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {start: Date.parse("Wed, 09 Aug 1995 08:00:00"),
                  end: Date.parse("Wed, 09 Aug 1995 11:00:00")};
  }

  componentDidMount() {
    $("#ex2").slider({
      formatter: function(value) {
        if (Array.isArray(value)) {
          let ranges = value.map(item => {
            return new Date(item).toString();
          });
          return ranges.join(',');
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
                <input id="ex2" type="text" className="span2" value="" data-slider-min={this.state.start} data-slider-tooltip="show" data-slider-max={this.state.end} data-slider-step="5" style={{width: "80%"}} data-slider-value="[807926400000, 807937200000]" />
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
