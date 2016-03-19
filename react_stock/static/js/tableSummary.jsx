import React from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios'
import accounting from 'accounting';
import fx from 'money';
import {formatPercent} from './util.jsx'

class TableSummary extends React.Component {
  constructor(props){
    super(props);
    this.state = {rates: {CNY: 7.0388, HKD: 8.3271}}
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
    setInterval(this.loadExchangesFromServer.bind(this), 60000);
  }

  render(){
    let totalCash = 399022.66;
    let cost = 795000.00;
    let totalChina = 0;
    let totalHK = 0;
    let prevChina = 0;
    let prevHK = 0;

    this.props.stocks.forEach(function(stock){
      let symbol = stock.symbol.toLowerCase();
      if (symbol.startsWith('sh') || stock.symbol.startsWith('sz')) {
        totalChina += stock.price * stock.volume;
        prevChina += stock.previous * stock.volume;
      }else if(stock.symbol.startsWith('hk')){
        totalHK += stock.price * stock.volume;
        prevHK += stock.previous * stock.volume;
      }
    });

    fx.rates = this.state.rates;
    let totalHKCNY = fx(totalHK).from("HKD").to("CNY");
    let prevHKCNY = fx(prevHK).from("HKD").to("CNY");
    let total = totalChina + totalHKCNY + totalCash;
    let prev = prevChina + prevHKCNY + totalCash;

    return (
      <div>
        <h3>汇总</h3>
        <div className="col-md-6" style={{paddingLeft: 0}}>
          <Table bordered condensed>
            <thead>
              <tr>
                <th>#</th>
                <th className="text-right">金额</th>
                <th className="text-right">日盈亏额</th>
                <th className="text-right">涨跌幅</th>
                <th className="text-right">百分比</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>沪深市值</td>
                <td className="text-right">{accounting.formatMoney(totalChina)}</td>
                <td className="text-right">{accounting.formatMoney(totalChina - prevChina)}</td>
                <td className="text-right">{formatPercent(prevChina, totalChina)}</td>
                <td className="text-right">{(totalChina/total*100).toFixed(2) + '%'}</td>
              </tr>
              <tr>
                <td>港股市值</td>
                <td className="text-right">{accounting.formatMoney(totalHK, "$")}<span style={{display: "block"}}>{accounting.formatMoney(totalHKCNY)}</span></td>
                <td className="text-right">{accounting.formatMoney(totalHK - prevHK, "$ ")}<span style={{display: "block"}}>{accounting.formatMoney(totalHKCNY - prevHKCNY)}</span></td>
                <td className="text-right">{formatPercent(prevHK, totalHK)}</td>
                <td className="text-right">{(totalHKCNY/total*100).toFixed(2) + '%'}</td>
              </tr>
              <tr>
                <td>总市值</td>
                <td className="text-right">{accounting.formatMoney(totalHKCNY + totalChina)}</td>
                <td className="text-right">{accounting.formatMoney(total - prev)}</td>
                <td className="text-right">{formatPercent(prevHKCNY + prevChina, totalHKCNY + totalChina)}</td>
                <td className="text-right">{((totalHKCNY + totalChina)/total*100).toFixed(2) + '%'}</td>
              </tr>
              <tr>
                <td>现金</td>
                <td className="text-right">{accounting.formatMoney(totalCash)}</td>
                <td className="text-center">--</td>
                <td className="text-center">--</td>
                <td className="text-right">{(totalCash/total*100).toFixed(2) + '%'}</td>
              </tr>
              <tr>
                <td>本金</td>
                <td className="text-right">{accounting.formatMoney(cost)}</td>
                <td className="text-center">--</td>
                <td className="text-right">{formatPercent(cost, total)}</td>
                <td className="text-center">--</td>
              </tr>
              <tr>
                <td>总资产</td>
                <td className="text-right">{accounting.formatMoney(total)}</td>
                <td className="text-right">{accounting.formatMoney(total - prev)}</td>
                <td className="text-right">{formatPercent(prev, total)}</td>
                <td className="text-right">100.00%</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default TableSummary;
