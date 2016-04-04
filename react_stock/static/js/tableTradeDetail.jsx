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
      showModalConfirm: false,
      showModalTrade: false
    }
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

  openModalTrade(trade) {
    this.trade = trade;
    this.setState({ showModalTrade: true });
  }

  closeModalTrade(confirm) {
    this.setState({ showModalTrade: false });
    if (this.trade != null && confirm) {
      this.props.onEditTrade(this.trade);
    }

    this.trade = null
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
            <ModalTrade showModal={(this.state.showModalTrade && this.trade) ? trade._id == this.trade._id: false} onClose={this.closeModalTrade.bind(this)} trade={trade} />&nbsp;
            <a onClick={this.openModalConfirm.bind(this, trade)}><span className="glyphicon glyphicon-trash"/></a>
            <ModalConfirm showModal={(this.state.showModalConfirm && this.trade) ? trade._id == this.trade._id: false} closeModal={this.closeModalConfirm.bind(this)} container={this} />
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
