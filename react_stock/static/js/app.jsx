import React from 'react';
import {render} from 'react-dom';
import TableMarket from './tableMarket.jsx'
import TableStock from './tableStock.jsx'
import TableSummary from './tableSummary.jsx'
import FormTrade from './formTrade.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {stocks: [], markets:[]}
  }

  loadStocksFromServer(){
    axios.get(this.props.urlStocks)
      .then(function(data){
        this.setState({stocks: data.data});
      }.bind(this))
      .catch(function(response){
        console.log(response);
      });
  }

  loadMarketsFromServer(){
    axios.get(this.props.urlMarkets)
      .then(function(data){
        this.setState({markets: data.data});
      }.bind(this))
      .catch(function(response){
        console.log(response);
      });
  }

  componentDidMount(){
    setInterval(this.loadStocksFromServer.bind(this), this.props.pollInterval);
    setInterval(this.loadMarketsFromServer.bind(this), this.props.pollInterval);
  }

  render() {
    return(
      <div className="container">
        <TableMarket markets={this.state.markets} />
        <TableStock stocks={this.state.stocks} />
        <FormTrade />
        <TableSummary stocks={this.state.stocks} />
      </div>
    );
  }
}

render(
  <App urlStocks='/api/stock' urlMarkets='/api/markets' pollInterval={3000} />,
  document.getElementById('content')
);
