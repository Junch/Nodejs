import React from 'react';
import { Table, Button } from 'react-bootstrap';
import accounting from 'accounting';
import {formatPercent} from './util.jsx'

class TableStock extends React.Component {
  constructor(props){
    super(props);
    this.state = {current: -1, selTrades: []};
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
    if (index == this.state.current) {
      index = -1;
    }

    if (index == -1) {
      this.setState({current: index});
      return;
    }

    let symbol = this.props.stocks[index].symbol;
    axios.get('/api/trade/' + symbol)
      .then(function(data){
        this.setState({current: index});
        this.setState({selTrades: data.data});
      }.bind(this))
      .catch(function(response){
        console.log(response);
      });
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


    if (this.state.current != -1) {
      let mRows = this.state.selTrades.map((stock, index) => {
        return(
          <tr>
            <td style={tdStyle}>{index}</td>
            <td style={tdStyle}>{stock.date}</td>
            <td style={tdStyle}>{stock.price}</td>
            <td style={tdStyle}>{stock.volume}</td>
          </tr>
        );
      });

      rows.splice(this.state.current + 1, 0, (
        <tr key="current">
          <td colSpan="7">
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
          </td>
        </tr>
      ));
    }

    return (
      <div>
        <h3>股票</h3>
        <Table striped bordered condensed>
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
