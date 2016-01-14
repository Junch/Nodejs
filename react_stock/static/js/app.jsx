import React from 'react';
import {render} from 'react-dom';
import TableMarket from './tableMarket.jsx'
import TableStock from './tableStock.jsx'
import TableSummary from './tableSummary.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {stocks: []}
  }

  loadStocksFromServer(){
    axios.get(this.props.url)
      .then(function(data){
        this.setState({stocks: data.data});
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
        <TableMarket />
        <TableStock stocks={this.state.stocks} />
        <TableSummary stocks={this.state.stocks} />
      </div>
    );
  }
}

render(
  <App url='/api/stocks' pollInterval={3000} />,
  document.getElementById('content')
);
