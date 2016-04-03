import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import '../css/zui-table.css'
import '../css/modal-dialog.css'
import accounting from 'accounting';
import {formatPercent} from './util.jsx'

class TableTradeDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = {showModalConfirm: false}
  }

  openModalConfirm(trade) {
    this.trade = trade;
    this.setState({ showModalConfirm: true });
  }

  closeModalConfirm(confirm) {
    this.setState({ showModalConfirm: false });
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
            <a><span className="glyphicon glyphicon-edit"/></a>&nbsp;
            <a onClick={this.openModalConfirm.bind(this, trade)}><span className="glyphicon glyphicon-trash"/></a>
            <Modal show={this.state.showModalConfirm} bsSize="small" container={this} onHide={e => this.close(false)}>
              <Modal.Header>
                <Modal.Title>提醒</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                确定删除这个交易?
              </Modal.Body>
              <Modal.Footer>
                <Button bsSize="small" bsStyle="primary" onClick={e => this.closeModalConfirm(true)}>确定</Button>
                <Button bsSize="small" onClick={e => this.closeModalConfirm(false)}>取消</Button>
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
