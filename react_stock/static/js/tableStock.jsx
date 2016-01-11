import React from 'react';
import { Table } from 'react-bootstrap';
import accounting from 'accounting';
import TableTotal from './tableSummary.jsx'
import {formatPercent} from './util.jsx'

class TableStock extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: []}
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

  loadStocksFromServer(){
    axios.get(this.props.url)
      .then(function(data){
        this.setState({data: data.data});
      }.bind(this))
      .catch(function(response){
        console.log(response);
      });
  }

  componentDidMount(){
    setInterval(this.loadStocksFromServer.bind(this), this.props.pollInterval);
  }

  render() {
    let totalChina = 0;
    let totalHK = 0;
    let prevChina = 0;
    let prevHK = 0;

    let rows = this.state.data.map(function(stock, index){
      if (stock.symbol.startsWith('SH') || stock.symbol.startsWith('SZ')) {
        totalChina += stock.price * stock.volume;
        prevChina += stock.previous * stock.volume;
      }else if(stock.symbol.startsWith('HK')){
        totalHK += stock.price * stock.volume;
        prevHK += stock.previous * stock.volume;
      }

      return (
        <tr key={stock.symbol}>
          <td>{stock.symbol}</td>
          <td>{stock.title}</td>
          <td className="text-right">{accounting.formatMoney(stock.price, "", 3)}</td>
          <td className="text-right" style={{"fontWeight":"bold"}}>{formatPercent(stock.previous, stock.price)}</td>
          <td className="text-right">{stock.volume}</td>
          <td className="text-right">{accounting.formatMoney(stock.price * stock.volume)}</td>
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
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
        <TableTotal totalHK={totalHK} prevHK={prevHK} totalChina={totalChina}  prevChina={prevChina}/>
      </div>
    );
  }
};

export default TableStock;
