import React from 'react';
import {render} from 'react-dom';
import TableStock from './tableStock.jsx'

class Demo extends React.Component {
  render() {
    return(
      <div className="container">
        <TableStock url='/api/stocks' pollInterval={3000} />
      </div>
    );
  }
}

render(
  <Demo />,
  document.getElementById('content')
);
