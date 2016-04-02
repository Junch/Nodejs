import React from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import '../css/zui-table.css'
import '../css/modal-dialog.css'
import accounting from 'accounting';
import {formatPercent} from './util.jsx'

class TableCash extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let mRows = this.props.cash.map((cash, index) => {
      return(
        <tr key={index}>
          <td>{index}</td>
          <td>{(new Date(cash.date)).toLocaleDateString()}</td>
          <td style={{textAlign: "right"}}>{accounting.formatMoney(cash.volume)}</td>
          <td className="col-md-2" style={{textAlign: "right"}}><a><span className="glyphicon glyphicon-edit"/></a>&nbsp;<a onClick={this.props.onDeleteCash.bind(this, cash)}><span className="glyphicon glyphicon-trash"/></a></td>
        </tr>
      );
    });

    return (
      <div className="row">
        <h3>本金</h3>
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
