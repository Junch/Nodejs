import React from 'react';
import { Table, Button } from 'react-bootstrap';
import accounting from 'accounting';
import {formatPercent} from './util.jsx'

class TableStock extends React.Component {
  constructor(props){
    super(props);
    accounting.settings = {
      currency: {
        symbol : "",   // default currency symbol is '$'
        format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
        decimal : ".",  // decimal point separator
        thousand: ",",  // thousands separator
        precision : 2   // decimal places
      },
      number: {
        precision : 0,  // default precision on numbers is 0
        thousand: ",",
        decimal : "."
      }
    }
  }

  handleClick (index, e) {
    e.preventDefault();
    console.log(index);
  }

  render() {
    let self = this;

    let rows = this.props.stocks.map((stock, index) => {
      return (
        <tr key={stock.symbol}>
          <td>{stock.symbol}</td>
          <td>{stock.title}</td>
          <td className="text-right">{accounting.formatMoney(stock.price, "", 3)}</td>
          <td className="text-right" style={{fontWeight:"bold"}}>{formatPercent(stock.previous, stock.price)}</td>
          <td className="text-right">{stock.volume}</td>
          <td className="text-right">{accounting.formatMoney(stock.price * stock.volume)}</td>
          <td className="text-right"><Button bsStyle="primary" bsSize="xsmall" onClick={self.handleClick.bind(self, index)}>交易</Button></td>
        </tr>
      );
    });

    return (
      <div>
        <h3>股票</h3>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>#</th>
              <th>股票</th>
              <th className="text-right">当前价</th>
              <th className="text-right">涨跌幅</th>
              <th className="text-right">持有量</th>
              <th className="text-right">市值</th>
              <th className="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </div>
    );
  }
};

export default TableStock;
