import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../css/main.css'
import React from 'react';
import axios from 'axios'
import {render} from 'react-dom';
import TableMarket from './tableMarket.jsx'
import TableStock from './tableStock.jsx'
import TableSummary from './tableSummary.jsx'
import TableCash from './TableCash.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {stocks: [], markets:[], cashes: []}
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

  loadCashesFromServer(){
    axios.get(this.props.urlCashes)
      .then(data => {
        this.setState({cashes: data.data});
      }).catch(response => {
        console.log(response);
      });
  }

  handleDeleteCash(cashid) {
    console.log(`Delete an item ${cashid}`)
    axios.delete('/api/cash/' + cashid)
      .then(() => {
        let newCashes = this.state.cashes.filter(item => {
          return item._id != cashid
        });

        this.setState({cashes: newCashes});
      }).catch(function(response){
        console.log(response);
      });
  }

  componentDidMount(){
    setInterval(this.loadStocksFromServer.bind(this), this.props.pollInterval);
    setInterval(this.loadMarketsFromServer.bind(this), this.props.pollInterval);
    this.loadCashesFromServer();
  }

  render() {
    return(
      <div className="container">
        <TableMarket markets={this.state.markets} />
        <TableStock stocks={this.state.stocks} />
        <TableCash cash={this.state.cashes} onDeleteCash={this.handleDeleteCash.bind(this)}/>
        <TableSummary stocks={this.state.stocks} />
      </div>
    );
  }
}

render(
  <App urlStocks='/api/stock' urlMarkets='/api/markets' urlCashes='/api/cash' pollInterval={3000} />,
  document.getElementById('content')
);
