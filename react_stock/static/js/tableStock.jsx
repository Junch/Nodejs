import React from 'react';
import { Table } from 'react-bootstrap';
import accounting from 'accounting'

function formatPercent(prev, price){
  let deta = price - prev;
  let str = (deta/prev*100).toFixed(2) + '%';
  if (deta > 0){
    str = '+' + str;
  }

  if (deta > 0)
    return <font color="red">{str}</font>;

  if (deta < 0)
    return <font color="green">{str}</font>;

  return <div>{str}</div>;
}

class TableDemo extends React.Component {
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
          this.setState({data: data.data})
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
      let rows = this.state.data.map(function(stock, index){
        if (stock.symbol.startsWith('SH') || stock.symbol.startsWith('SZ')) {
          totalChina += stock.price * stock.volume;
        }else if(stock.symbol.startsWith('HK')){
          totalHK += stock.price * stock.volume;
        }

        return (
          <tr key={stock.symbol}>
            <td>{stock.symbol}</td>
            <td>{stock.title}</td>
            <td>{accounting.formatMoney(stock.price, "", 3)}</td>
            <td className="text-right" style={{"fontWeight":"bold"}}>{formatPercent(stock.previous, stock.price)}</td>
            <td>{stock.volume}</td>
            <td className="text-right">{accounting.formatMoney(stock.price * stock.volume)}</td>
          </tr>
        );
      });

      return (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>#</th>
              <th>股票</th>
              <th>当前价</th>
              <th>涨跌幅</th>
              <th>持有量</th>
              <th>市值</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
          <tfoot>
            <tr>
              <td>沪深市值</td>
              <td colSpan="2" className="text-center">{accounting.formatMoney(totalChina)}</td>
              <td>港股市值</td>
              <td colSpan="2" className="text-center">{accounting.formatMoney(totalHK)}</td>
            </tr>
          </tfoot>
        </Table>
    );
  }
};

export default TableDemo;
