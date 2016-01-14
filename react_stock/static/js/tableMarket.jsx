import React from 'react';

export default class TableMarket extends React.Component {
  render(){
    let markets = [
      {name: "上证指数", price: 3007.65, deta: 58.05, percent: 1.97},
      {name: "深证成指", price: 10344.94, deta: 366.12, percent: 3.67},
      {name: "创业板指", price: 2175.01, deta: 115.24, percent: 5.59},
      {name: "沪深300", price: 3221.57, deta: 65.69, percent: 2.08},
      {name: "上证500", price: 6124.82, deta: 200.78, percent: 3.39},
      {name: "恒生指数", price: 19817.41, deta: -117.47 , percent: -0.59}
    ];

    let items = markets.map(function(market, index){
      let color = ""
      if (market.deta > 0)
        color = "red"
      else if(market.deta < 0)
        color = "green"

      let deta = market.deta.toFixed(2)
      if (market.deta > 0)
        deta = '+' + deta;

      let percent = market.percent.toFixed(2) + '%'
      if (market.percent > 0)
        percent = '+' + percent

      return (
        <div className = "col-sm-3 col-md-2 text-center" style={{outline: "solid 1px #d4d4d4"}} key={index}>
            {market.name}
            <div style={{color: color, fontSize: "large", fontWeight:"bold"}}>{market.price}</div>
            <div style={{color: color, fontSize: "small"}}>{deta}&nbsp;&nbsp;&nbsp;&nbsp;{percent}</div>
        </div>
      );
    });

    return(
      <div>
        <h3>大盘</h3>
        <div className="row" style={{marginLeft: "0px", marginRight: "0px"}}>
          {items}
        </div>
      </div>
    );
  }
}
