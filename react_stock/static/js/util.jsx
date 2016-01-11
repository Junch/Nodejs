import React from 'react';

export function formatPercent(prev, price){
  let deta = price - prev;
  let str = (deta/prev*100).toFixed(2) + '%';
  if (deta > 0){
    str = '+' + str;
  }

  if (deta > 0)
    return <font color="red">{str}</font>;

  if (deta < 0)
    return <font color="green">{str}</font>;

  return <div>{str}</div>;
}
