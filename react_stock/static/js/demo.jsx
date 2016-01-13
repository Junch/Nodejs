import React from 'react';
import {render} from 'react-dom';
import TableStock from './tableStock.jsx'
import TableSummary from './tableSummary.jsx'

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: []}
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
    return(
      <div className="container">
        <TableStock data={this.state.data} />
        <TableSummary data={this.state.data} />
      </div>
    );
  }
}

render(
  <Demo url='/api/stocks' pollInterval={3000} />,
  document.getElementById('content')
);
