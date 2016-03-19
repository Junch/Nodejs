import React from 'react';
import { Collapse, Button, Alert} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import '../../node_modules/react-datepicker/dist/react-datepicker.css'

export default class FormTrade extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = this.getDefaultState();
    this.state.startDate = moment();
  }

  getDefaultState() {
    let defaultState = {
      symbol:'',
      price:'',
      volume:'',
      type:'buy',
      alertVisible:true,
      alertStyle:"success"
    }

    return defaultState;
  }

  handleSubmit(e) {
    e.preventDefault();

    let trade = {
      symbol: this.state.symbol,
      volume: Number(this.state.volume),
      date: this.state.startDate,
      price: Number(this.state.price) 
    }

    if (this.state.type == 'sell') {
      trade.volume = - trade.volume
    }

    let defaultState = this.getDefaultState();
    let type = (this.state.type == 'buy') ? '买入':'卖出';

    axios.post('/api/trade', trade).then(response => {
      defaultState.alertMsg = `交易成功：${type}股票${this.state.symbol},价格${this.state.price}元,数量${this.state.volume}`
      this.setState(defaultState);
    }).catch(response => {
      defaultState.alertMsg = `交易失败：${type}股票${this.state.symbol},价格${this.state.price}元,数量${this.state.volume}`
      defaultState.alertStyle = 'danger';
      this.setState(defaultState);
      console.log(response);
    });
  }

  render() {
    let alertDiv = <div/>
    if (this.state.alertVisible) {
      alertDiv = (
        <Alert bsStyle={this.state.alertStyle} style={{marginTop: "1.2em"}} onDismiss={()=>this.setState({alertVisible: false})} dismissAfter={5000} >
          {this.state.alertMsg}
        </Alert>
      )
    }

    return (
      <div className="col-sm-12" style={{marginBottom: "1.2em"}}>
        <div className="col-sm-6" >
          <Button bsStyle="primary" onClick={e => this.setState({open: !this.state.open})}>
            买卖
          </Button>
          <Collapse in={this.state.open}>
            <form style={{marginTop: "1.2em"}} onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group row">
                <label htmlFor="symbol" className="col-sm-2 form-control-label">股票</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="symbol" value={this.state.symbol} onChange={e=>this.setState({symbol: e.target.value})} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="type" className="col-sm-2 form-control-label">类型</label>
                <div className="col-sm-10">
                  <select className="form-control" id="type" value={this.state.type} onChange={e=>this.setState({type: e.target.value})} >
                    <option value="buy">买入</option>
                    <option value="sell">卖出</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="date" className="col-sm-2 form-control-label">日期</label>
                <div className="col-sm-10">
                  <DatePicker selected={this.state.startDate} onChange={ date => this.setState({startDate: date})} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="price" className="col-sm-2 form-control-label">价格</label>
                <div className="col-sm-10">
                  <input type="number" className="form-control" id="price" min="0" step="0.001" value={this.state.price} onChange={e=>this.setState({price: e.target.value})} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="volume" className="col-sm-2 form-control-label">数量</label>
                <div className="col-sm-10">
                  <input type="number" className="form-control" id="volume" min="0" step="100" value={this.state.volume} onChange={e=>this.setState({volume: e.target.value})} />
                </div>
              </div>
              <Button type="submit" bsStyle="primary">Submit</Button>
              {alertDiv}
            </form>
          </Collapse>
        </div>
      </div>
    );
  }
}
