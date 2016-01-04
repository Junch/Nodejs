import React from 'react';
import { Table } from 'react-bootstrap';
import accounting from 'accounting'

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

  componentDidMount(){
    axios.get(this.props.url)
      .then(function(data){
          this.setState({data: data.data})
      }.bind(this))
      .catch(function(response){
          console.log(response);
      });
  }

  render() {
      let total = 0;
      let rows = this.state.data.map(function(stock, index){
        total += stock.price * stock.volume;

        return (
          <tr key={stock.symbol}>
            <td>{stock.symbol}</td>
            <td>{stock.title}</td>
            <td>{accounting.formatMoney(stock.price, "", 3)}</td>
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
              <th>持有量</th>
              <th>持有市值</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
          <tfoot>
            <tr>
              <td>总市值</td>
              <td colSpan="4" className="text-center">{accounting.formatMoney(total)}</td>
            </tr>
          </tfoot>
        </Table>
    );
  }
};

export default TableDemo;
