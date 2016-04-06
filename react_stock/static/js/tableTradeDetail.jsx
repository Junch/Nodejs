import React from 'react';
import ModalConfirm from './modalConfirm.jsx'
import '../css/zui-table.css'
import accounting from 'accounting';
import {formatPercent} from './util.jsx'
import ModalTrade from './modalTrade.jsx'

class TableTradeDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      confirmid: null,
      tradeid: null
    }
  }

  openModalConfirm(trade) {
    this.setState({ confirmid: trade._id });
  }

  closeModalConfirm(confirm) {
    if (this.state.confirmid != null && confirm) {
      this.props.onDeleteTrade(this.state.confirmid);
    }

    this.setState({ confirmid: null });
  }

  openModalTrade(trade) {
    this.setState({ tradeid: trade._id });
  }

  closeModalTrade(confirm) {
    if (this.state.tradeid != null && confirm) {
      this.props.onEditTrade(this.state.tradeid);
    }

    this.setState({ tradeid: null });
  }

  render() {
    let mRows = this.props.selTrades.map((trade, index) => {
      return(
        <tr key={trade._id}>
          <td>{index}</td>
          <td>{(new Date(trade.date)).toLocaleDateString()}</td>
          <td style={{textAlign: "right"}}>{accounting.formatMoney(trade.price)}</td>
          <td style={{textAlign: "right"}}>{trade.volume}</td>
          <td style={{textAlign: "right"}}>
            <a onClick={this.openModalTrade.bind(this, trade)}><span className="glyphicon glyphicon-edit"/></a>
            <ModalTrade showModal={ this.state.tradeid === trade._id } onClose={this.closeModalTrade.bind(this)} trade={trade} />&nbsp;
            <a onClick={this.openModalConfirm.bind(this, trade)}><span className="glyphicon glyphicon-trash"/></a>
            <ModalConfirm showModal={this.state.confirmid === trade._id} closeModal={this.closeModalConfirm.bind(this)} />
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
