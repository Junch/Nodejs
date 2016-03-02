import React from 'react';
import { Table, Button } from 'react-bootstrap';
import accounting from 'accounting';
import {formatPercent} from './util.jsx'

class TableTradeDetail extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    // http://roxeteer.com/table-border-css/
    let tabStyle = {
      borderColor: "black",
      borderWidth: "0 0 1px 1px",
      borderStyle: "solid",
      backgroundColor: "gold",
      borderSpacing: "0"
    }

    let tdStyle = {
      borderColor: "black",
      borderWidth: "1px 1px 0 0",
      borderStyle: "solid",
      margin: "0",
      padding: "4px",
      backgroundColor: "gold",
      borderSpacing: "0"
    }

    let mRows = this.props.selTrades.map((stock, index) => {
      return(
        <tr key={index}>
          <td style={tdStyle}>{index}</td>
          <td style={tdStyle}>{stock.date}</td>
          <td style={tdStyle}>{stock.price}</td>
          <td style={tdStyle}>{stock.volume}</td>
        </tr>
      );
    });

    return (
      <Table style={tabStyle}>
        <thead>
          <tr>
            <th style={tdStyle}>#</th>
            <th style={tdStyle}>日期</th>
            <th style={tdStyle}>价格</th>
            <th style={tdStyle}>数量</th>
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
