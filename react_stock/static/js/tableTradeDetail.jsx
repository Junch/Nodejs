import React from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import '../css/zui-table.css'
import '../css/modal-dialog.css'
import accounting from 'accounting';
import {formatPercent} from './util.jsx'

class TableTradeDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = {showModal: false}
  }

  open(trade) {
    this.trade = trade;
    this.setState({ showModal: true });
  }

  close(confirm) {
    this.setState({ showModal: false });
    if (this.trade != null && confirm) {
      this.props.onDeleteTrade(this.trade);
    }

    this.trade = null
  }

  render() {
    let mRows = this.props.selTrades.map((trade, index) => {
      return(
        <tr key={index}>
          <td>{index}</td>
          <td>{(new Date(trade.date)).toLocaleDateString()}</td>
          <td style={{textAlign: "right"}}>{accounting.formatMoney(trade.price)}</td>
          <td style={{textAlign: "right"}}>{trade.volume}</td>
          <td style={{textAlign: "right"}}>
            <a onClick={this.open.bind(this, trade)}><span className="glyphicon glyphicon-trash"/></a>
            <Modal show={this.state.showModal} bsSize="small" container={this}>
              <Modal.Header>
                <Modal.Title>提醒</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                确定删除这个交易?
              </Modal.Body>
              <Modal.Footer>
                <Button bsSize="small" bsStyle="primary" onClick={e => this.close(true)}>确定</Button>
                <Button bsSize="small" onClick={e => this.close(false)}>取消</Button>
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
