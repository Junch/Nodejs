import React from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import './tableTradeDetail.css'
import accounting from 'accounting';
import {formatPercent} from './util.jsx'

class TableTradeDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = {showModal: false}
  }

  open() {
    this.setState({ showModal: true });
  }

  close(trade) {
    this.setState({ showModal: false });
    if (trade != null){
      this.props.onDeleteTrade(trade);
    }
  }

  render() {
    let self = this;

    let mRows = this.props.selTrades.map((trade, index) => {
      return(
        <tr key={index}>
          <td>{index}</td>
          <td>{(new Date(trade.date)).toLocaleDateString()}</td>
          <td style={{textAlign: "right"}}>{accounting.formatMoney(trade.price)}</td>
          <td style={{textAlign: "right"}}>{trade.volume}</td>
          <td style={{textAlign: "right"}}>
            <a onClick={this.open.bind(this)}><span className="glyphicon glyphicon-trash"/></a>
            <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
              <Modal.Header>
                <Modal.Title>提醒</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                确定删除这个交易?
              </Modal.Body>
              <Modal.Footer>
                <Button bsSize="small" bsStyle="primary" onClick={this.close.bind(this, trade)}>确定</Button>
                <Button bsSize="small" onClick={this.close.bind(this, null)}>取消</Button>
              </Modal.Footer>
            </Modal>
          </td>
        </tr>
      );
    });

    return (
      <table className="zui-table zui-table-rounded">
        <thead>
          <tr>
            <th>#</th>
            <th>日期</th>
            <th style={{textAlign: "right"}}>价格</th>
            <th style={{textAlign: "right"}}>数量</th>
            <th style={{textAlign: "right"}}>操作</th>
          </tr>
        </thead>
        <tbody>
          {mRows}
        </tbody>
      </table>
    );
  }
}

export default TableTradeDetail;
