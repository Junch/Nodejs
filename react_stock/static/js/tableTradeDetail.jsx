import React from 'react';
import { Table, Button } from 'react-bootstrap';
import './tableTradeDetail.css'
import accounting from 'accounting';
import {formatPercent} from './util.jsx'

class TableTradeDetail extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let mRows = this.props.selTrades.map((stock, index) => {
      return(
        <tr key={index}>
          <td>{index}</td>
          <td>{(new Date(stock.date)).toLocaleDateString()}</td>
          <td style={{textAlign: "right"}}>{stock.price}</td>
          <td style={{textAlign: "right"}}>{stock.volume}</td>
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
