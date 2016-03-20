import React from 'react';

export default class TableMarket extends React.Component {
  render(){
    let items = this.props.markets.map(function(market, index){
      let color = ""
      market.deta = market.price - market.previous
      if (market.deta > 0)
        color = "red"
      else if(market.deta < 0)
        color = "green"

      let deta = market.deta.toFixed(2)
      if (market.deta > 0)
        deta = '+' + deta;

      market.percent = market.deta/market.previous*100
      let percent = market.percent.toFixed(2) + '%'
      if (market.percent > 0)
        percent = '+' + percent

      return (
        <div className = "col-sm-3 col-md-2 text-center" style={{outline: "solid 1px #d4d4d4"}} key={index}>
            {market.title}
            <div style={{color: color, fontSize: "large", fontWeight:"bold"}}>{market.price}</div>
            <div style={{color: color, fontSize: "small"}}>{deta}&nbsp;&nbsp;&nbsp;&nbsp;{percent}</div>
        </div>
      );
    });

    return(
      <div className="row">
        <h3>大盘</h3>
        <div className="row" style={{marginLeft: "0px", marginRight: "0px"}}>
          {items}
        </div>
      </div>
    );
  }
}
