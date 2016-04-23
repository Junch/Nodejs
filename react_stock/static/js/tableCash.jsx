import React from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import ModalConfirm from './modalConfirm.jsx'
import ModalCash from './modalCash.jsx'
import '../css/zui-table.css'
import accounting from 'accounting';
import {formatPercent} from './util.jsx'
import axios from 'axios'

class TableCash extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cashid: null,
      confirmid: null
    }
  }

  openModalConfirm(cash) {
    this.setState({ confirmid: cash._id });
  }

  closeModalConfirm(confirm) {
    if (this.state.confirmid != null && confirm) {
      this.handleDeleteCash(this.state.confirmid).then(()=>{
        this.props.onRefresh();
      });
    }

    this.setState({confirmid: null});
  }

  doModal(){
    this.setState({showModal: true});
  }

  handleClose(fresh){
    this.setState({showModal: false})
    if (fresh)
      this.props.onRefresh();
  }

  handleDeleteCash(cashid) {
    return axios.delete('/api/cash/' + cashid);
  }

  openModalCash(cash) {
    this.setState({ cashid: cash._id });
  }

  closeModalCash(confirm) {
    if (this.state.cashid != null && confirm) {
      this.props.onRefresh();
    }

    this.setState({ cashid: null });
  }

  render() {
    let mRows = this.props.cash.map((cash, index) => {
      return(
        <tr key={cash._id}>
          <td>{index}</td>
          <td>{(new Date(cash.date)).toLocaleDateString()}</td>
          <td style={{textAlign: "right"}}>{accounting.formatMoney(cash.volume)}</td>
          <td className="col-md-2" style={{textAlign: "right"}}><a onClick={this.openModalCash.bind(this, cash)}><span className="glyphicon glyphicon-edit"/></a>
          <ModalCash showModal={ this.state.cashid === cash._id } onClose={this.closeModalCash.bind(this)} cash={cash} />&nbsp;
          <a onClick={this.openModalConfirm.bind(this, cash)}><span className="glyphicon glyphicon-trash"/></a>
          <ModalConfirm showModal={this.state.confirmid === cash._id} closeModal={this.closeModalConfirm.bind(this)} container={this} />
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
