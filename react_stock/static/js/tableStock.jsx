import React from 'react';
import { Table } from 'react-bootstrap';

class TableDemo extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: []}
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
            <td>{stock.price}</td>
            <td>{stock.volume}</td>
            <td>{stock.price * stock.volume}</td>
          </tr>
        );
      });

      return <Table striped bordered condensed hover>
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
            <td colSpan="4" className="text-center">{total}</td>
          </tr>
        </tfoot>
      </Table>
  }
};

export default TableDemo;
