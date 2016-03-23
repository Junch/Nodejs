import React from 'react'
import {Button, Modal, Input, Alert} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import '../../node_modules/react-datepicker/dist/react-datepicker.css'
import moment from 'moment';
import axios from 'axios'

export default class ModalTrade extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      symbol:'',
      price:'',
      volume:'',
      type:'buy',
      alertVisible:false,
      startDate:moment()
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    let trade = {
      symbol: this.state.symbol.toLowerCase(),
      volume: Number(this.state.volume),
      date:   this.state.startDate,
      price:  Number(this.state.price) 
    }

    if (this.state.type == 'sell') {
      trade.volume = - trade.volume
    }

    axios.post('/api/trade', trade).then(response => {
      this.props.onClose();
    }).catch(error => {
      console.log(error);
      let type = (this.state.type == 'buy') ? '买入':'卖出';
      let alertMsg = `交易失败：${type}股票${this.state.symbol},价格${this.state.price}元,数量${this.state.volume}`
      this.setState({alertVisible: true, alertMsg: alertMsg});
    });
  }

  render() {
    let alertDiv;
    if (this.state.alertVisible) {
      alertDiv = (
        <Alert bsStyle="danger" style={{marginTop: "1.2em"}} onDismiss={()=>this.setState({alertVisible: false})} dismissAfter={5000} >
          {this.state.alertMsg}
        </Alert>
      )
    }

    return (
      <Modal show={this.props.showModal} bsSize="small" onHide={e => this.props.onClose()}>
        <Modal.Header closeButton>
          <Modal.Title>买卖股票</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal">
            <div className="form-group row">
              <label htmlFor="symbol" className="col-sm-3 form-control-label">股票</label>
              <div className="col-sm-9" style={{paddingLeft: "0"}}>
                <input type="text" className="form-control" id="symbol" value={this.state.symbol} onChange={e=>this.setState({symbol: e.target.value})} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="type" className="col-sm-3 form-control-label">类型</label>
              <div className="col-sm-9" style={{paddingLeft: "0"}}>
                <select className="form-control" id="type" value={this.state.type} onChange={e=>this.setState({type: e.target.value})} >
                  <option value="buy">买入</option>
                  <option value="sell">卖出</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="date" className="col-sm-3 form-control-label">日期</label>
              <div className="col-sm-9" style={{paddingLeft: "0"}}>
                <DatePicker selected={this.state.startDate} onChange={ date => this.setState({startDate: date})} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="price" className="col-sm-3 form-control-label">价格</label>
              <div className="col-sm-9" style={{paddingLeft: "0"}}>
                <input type="number" className="form-control" id="price" min="0" step="0.001" value={this.state.price} onChange={e=>this.setState({price: e.target.value})} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="volume" className="col-sm-3 form-control-label">数量</label>
              <div className="col-sm-9" style={{paddingLeft: "0"}}>
                <input type="number" className="form-control" id="volume" min="0" step="100" value={this.state.volume} onChange={e=>this.setState({volume: e.target.value})} />
              </div>
            </div>
            {alertDiv}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" bsStyle="primary" onClick={e => this.handleSubmit(e)}>确定</Button>
          <Button bsSize="small" onClick={e => this.props.onClose()}>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}