import React from 'react';
import { Table } from 'react-bootstrap';
import accounting from 'accounting';
import fx from 'money';

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
    this.state = {data: [],
                  rates: {CNY: 7.0388, HKD: 8.3271}}
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

  loadExchangesFromServer(){
    axios.get('http://api.fixer.io/latest?symbols=CNY,HKD')
      .then(function(data){
        this.setState({rates: data.data.rates});
      }.bind(this))
      .catch(function(response){
        console.log(response);
      });
  }

  componentDidMount(){
    setInterval(this.loadStocksFromServer.bind(this), this.props.pollInterval);
    setInterval(this.loadExchangesFromServer.bind(this), 60000);
  }

  render() {
    let totalChina = 0;
    let totalHK = 0;
    let totalCash = 501729.96;
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
          <td className="text-right">{stock.volume}</td>
          <td className="text-right">{accounting.formatMoney(stock.price * stock.volume)}</td>
        </tr>
      );
    });

    fx.rates = this.state.rates;
    let totalHKCNY = fx(totalHK).from("HKD").to("CNY");
    let total = totalChina + totalHKCNY + totalCash;

    return (
      <div>
        <h3>股票</h3>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>#</th>
              <th>股票</th>
              <th>当前价</th>
              <th className="text-right">涨跌幅</th>
              <th className="text-right">持有量</th>
              <th className="text-right">市值</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
        <h3>汇总</h3>
        <div className="col-md-4" style={{paddingLeft: 0}}>
          <Table bordered condensed>
            <thead>
              <tr>
                <th>#</th>
                <th className="text-right">金额</th>
                <th className="text-right">百分比</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>沪深市值</td>
                <td className="text-right">{accounting.formatMoney(totalChina)}</td>
                <td className="text-right">{(totalChina/total*100).toFixed(2) + '%'}</td>
              </tr>
              <tr>
                <td>港股市值</td>
                <td className="text-right">{accounting.formatMoney(totalHK)}<span style={{display: "block"}}>{accounting.formatMoney(totalHKCNY)}</span></td>
                <td className="text-right">{(totalHKCNY/total*100).toFixed(2) + '%'}</td>
              </tr>
              <tr>
                <td>现金</td>
                <td className="text-right">{accounting.formatMoney(totalCash)}</td>
                <td className="text-right">{(totalCash/total*100).toFixed(2) + '%'}</td>
              </tr>
              <tr>
                <td>总资产</td>
                <td className="text-right">{accounting.formatMoney(total)}</td>
                <td className="text-right">100.00%</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
};

export default TableDemo;
