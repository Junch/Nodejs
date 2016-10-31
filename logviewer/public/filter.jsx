import React from 'react';

export default class FilterPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $("#ex2").slider({});
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
                <b>€ 10</b> <input id="ex2" type="text" className="span2" value="" data-slider-min="10" data-slider-max="1000" data-slider-step="5" style={{width: "80%"}} data-slider-value="[250,450]"/> <b>€ 1000</b>
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