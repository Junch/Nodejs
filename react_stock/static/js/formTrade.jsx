import React from 'react';
import { Collapse, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class FormTrade extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {startDate: moment()};
  }

  render() {
    return (
      <div className="col-sm-12" style={{marginBottom: "15px"}}>
        <div className="col-sm-6" >
          <Button bsStyle="primary" onClick={ ()=> this.setState({ open: !this.state.open })}>
            买卖
          </Button>
          <Collapse in={this.state.open}>
            <form style={{marginTop: "15px"}}>
              <div className="form-group row">
                <label htmlFor="type" className="col-sm-2 form-control-label">类型</label>
                <div className="col-sm-10">
                  <select type="email" className="form-control" id="type">
                    <option value="1">买入</option>
                    <option value="1">卖出</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="date" className="col-sm-2 form-control-label">日期</label>
                <div className="col-sm-10">
                  <DatePicker selected={this.state.startDate} onChange={ (date)=> this.setState({startDate: date}) }/>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="price" className="col-sm-2 form-control-label">价格</label>
                <div className="col-sm-10">
                  <input type="email" className="form-control" id="price"/>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="volume" className="col-sm-2 form-control-label">数量</label>
                <div className="col-sm-10">
                  <input type="email" className="form-control" id="volume"/>
                </div>
              </div>
              <Button type="submit" bsStyle="primary">Submit</Button>
            </form>
          </Collapse>
        </div>
      </div>
    );
  }
}
