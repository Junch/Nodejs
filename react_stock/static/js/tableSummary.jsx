import React from 'react';
import { Table } from 'react-bootstrap';
import accounting from 'accounting';
import fx from 'money';

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
    fx.rates = this.state.rates;
    let totalHKCNY = fx(this.props.totalHK).from("HKD").to("CNY");
    let total = this.props.totalChina + totalHKCNY + this.props.totalCash;
    console.log('total=' + total);

    return (
      <div>
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
                <td className="text-right">{accounting.formatMoney(this.props.totalChina)}</td>
                <td className="text-right">{(this.props.totalChina/total*100).toFixed(2) + '%'}</td>
              </tr>
              <tr>
                <td>港股市值</td>
                <td className="text-right">{accounting.formatMoney(this.props.totalHK)}<span style={{display: "block"}}>{accounting.formatMoney(totalHKCNY)}</span></td>
                <td className="text-right">{(totalHKCNY/total*100).toFixed(2) + '%'}</td>
              </tr>
              <tr>
                <td>现金</td>
                <td className="text-right">{accounting.formatMoney(this.props.totalCash)}</td>
                <td className="text-right">{(this.props.totalCash/total*100).toFixed(2) + '%'}</td>
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
}

export default TableSummary;
