import React from 'react'
import {Button, Modal, Input} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import '../../node_modules/react-datepicker/dist/react-datepicker.css'
import moment from 'moment';

export default class ModalTrade extends React.Component {

  constructor(props){
    super(props);

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

  render() {
    return (
      <Modal show={this.props.showModal} bsSize="small" onHide={e => this.props.onClose()}>
        <Modal.Header closeButton>
          <Modal.Title>买卖股票</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal">
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
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" bsStyle="primary" onClick={e => this.props.onClose()}>确定</Button>
          <Button bsSize="small" onClick={e => this.props.onClose()}>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}