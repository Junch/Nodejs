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
          <td id="tradeTd">{index}</td>
          <td id="tradeTd">{(new Date(stock.date)).toLocaleDateString()}</td>
          <td id="tradeTd">{stock.price}</td>
          <td id="tradeTd">{stock.volume}</td>
        </tr>
      );
    });

    return (
      <Table id="tradeTable">
        <thead>
          <tr>
            <th id="tradeTd">#</th>
            <th id="tradeTd">日期</th>
            <th id="tradeTd">价格</th>
            <th id="tradeTd">数量</th>
          </tr>
        </thead>
        <tbody>
          {mRows}
        </tbody>
      </Table>
    );
  }
}

export default TableTradeDetail;
