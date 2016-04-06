import React from 'react';
import { Table, Button } from 'react-bootstrap';
import accounting from 'accounting';
import axios from 'axios'
import {formatPercent} from './util.jsx'
import TableTradeDetail from './tableTradeDetail.jsx'
import ModalTrade from './modalTrade.jsx'

class TableStock extends React.Component {
  constructor(props){
    super(props);
    this.state = {current: -1, selTrades: [], showModal: false};
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
      .then(data => {
        this.setState({current: index});
        this.setState({selTrades: data.data});
      }).catch(response => {
        console.log(response);
      });
  }

  handleDelete(tradeid) {
    console.log(`Delete an item ${tradeid}`)
    axios.delete('/api/trade/' + tradeid)
      .then(data => {
        let newTrades = this.state.selTrades.filter(item => {
          return item._id != tradeid
        });

        this.setState({selTrades: newTrades});
      }).catch(response => {
        console.log(response);
      });
  }

  handleEdit(tradeid) {
    let arr = this.state.selTrades.filter(item => {
      return item._id === tradeid;
    });

    if (arr.length == 0)
      return;

    axios.get('/api/trade/' + arr[0].symbol)
      .then(data => {
        this.setState({selTrades: data.data});
      }).catch(response => {
        console.log(response);
      });
  }

  doModal(){
    this.setState({showModal: true});
  }

  handleClose(){
    this.setState({showModal: false})
  }

  render() {
    let rows = this.props.stocks.map((stock, index) => {
      return (
        <tr key={stock.symbol}>
          <td>{stock.symbol}</td>
          <td>{stock.title}</td>
          <td className="text-right">{accounting.formatMoney(stock.price, "", 3)}</td>
          <td className="text-right" style={{fontWeight:"bold"}}>{formatPercent(stock.previous, stock.price)}</td>
          <td className="text-right">{stock.volume}</td>
          <td className="text-right">{accounting.formatMoney(stock.price * stock.volume)}</td>
          <td className="text-right"><Button bsStyle="primary" bsSize="xsmall" onClick={e => this.handleClick(index, e)}>交易记录</Button></td>
        </tr>
      );
    });

    if (this.state.current != -1 && this.state.selTrades.length > 0) {
      rows.splice(this.state.current + 1, 0, (
        <tr key="current">
          <td colSpan="7">
            <TableTradeDetail selTrades={this.state.selTrades} onDeleteTrade={this.handleDelete.bind(this)} onEditTrade={this.handleEdit.bind(this)} />
          </td>
        </tr>
      ));
    }

    return (
      <div className="row">
        <h3>股票<a onClick={e => this.doModal()}>
          <span className="glyphicon glyphicon-list-alt"></span>
        </a></h3>
        <ModalTrade showModal={this.state.showModal} onClose={this.handleClose.bind(this)} />
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
