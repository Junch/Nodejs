import React from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import ModalConfirm from './modalConfirm.jsx'
import ModalCash from './modalCash.jsx'
import '../css/zui-table.css'
import accounting from 'accounting';
import {formatPercent} from './util.jsx'

class TableCash extends React.Component {
  constructor(props){
    super(props);
    this.state = {cashid: null}
  }

  openModalConfirm(cash) {
    this.setState({ cashid: cash._id });
  }

  closeModalConfirm(confirm) {
    if (this.state.cashid != null && confirm) {
      this.props.onDeleteCash(this.state.cashid);
    }

    this.setState({ cashid: null});
  }

  doModal(){
    this.setState({showModal: true});
  }

  handleClose(fresh){
    this.setState({showModal: false})
    if (fresh)
      this.props.onRefresh();
  }

  render() {
    let mRows = this.props.cash.map((cash, index) => {
      return(
        <tr key={index}>
          <td>{index}</td>
          <td>{(new Date(cash.date)).toLocaleDateString()}</td>
          <td style={{textAlign: "right"}}>{accounting.formatMoney(cash.volume)}</td>
          <td className="col-md-2" style={{textAlign: "right"}}><a><span className="glyphicon glyphicon-edit"/></a>&nbsp;
          <a onClick={this.openModalConfirm.bind(this, cash)}><span className="glyphicon glyphicon-trash"/></a>
          <ModalConfirm showModal={cash._id === this.state.cashid} closeModal={this.closeModalConfirm.bind(this)} container={this} />
          </td>
        </tr>
      );
    });

    return (
      <div className="row">
        <h3>本金<a onClick={e => this.doModal()}>
          <span className="glyphicon glyphicon-list-alt"></span>
        </a></h3>
        <ModalCash showModal={this.state.showModal} onClose={this.handleClose.bind(this)} />
        <div className="col-md-6" style={{paddingLeft: 0}}>
          <table className="zui-table zui-table-rounded">
            <thead>
              <tr>
                <th>#</th>
                <th>日期</th>
                <th style={{textAlign: "right"}}>金额</th>
                <th className="col-md-2" style={{textAlign: "right"}}>操作</th>
              </tr>
            </thead>
            <tbody>
              {mRows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TableCash;
