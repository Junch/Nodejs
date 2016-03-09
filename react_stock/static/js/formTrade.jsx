import React from 'react';
import { Collapse, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class FormTrade extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {startDate: moment(), symbol: '', price:'', volume: ''};
  }

  handleSubmit(e) {
    e.preventDefault();

    axios.post('/api/trade', {
      symbol: this.state.symbol,
      volume: Number(this.state.volume),
      date: this.state.startDate,
      price: Number(this.state.price) 
    }).then(function(response){
      this.setState({symbol:'', price: '', volume: ''});
    }.bind(this)).catch(function(response){
      this.setState({price: '', volume: ''});
      console.log(response);
    }.bind(this));
  }

  render() {
    return (
      <div className="col-sm-12" style={{marginBottom: "1.2em"}}>
        <div className="col-sm-6" >
          <Button bsStyle="primary" onClick={ ()=> this.setState({ open: !this.state.open })}>
            买卖
          </Button>
          <Collapse in={this.state.open}>
            <form style={{marginTop: "1.2em"}} onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group row">
                <label htmlFor="symbol" className="col-sm-2 form-control-label">股票</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="symbol" value={this.state.symbol} onChange={(e)=> this.setState({symbol: e.target.value})} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="type" className="col-sm-2 form-control-label">类型</label>
                <div className="col-sm-10">
                  <select className="form-control" id="type">
                    <option value="1">买入</option>
                    <option value="1">卖出</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="date" className="col-sm-2 form-control-label">日期</label>
                <div className="col-sm-10">
                  <DatePicker selected={this.state.startDate} onChange={ (date)=> this.setState({startDate: date})} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="price" className="col-sm-2 form-control-label">价格</label>
                <div className="col-sm-10">
                  <input type="number" className="form-control" id="price" min="0" step="0.001" value={this.state.price} onChange={(e)=> this.setState({price: e.target.value})} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="volume" className="col-sm-2 form-control-label">数量</label>
                <div className="col-sm-10">
                  <input type="number" className="form-control" id="volume" min="0" step="100" value={this.state.volume} onChange={(e)=> this.setState({volume: e.target.value})} />
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
