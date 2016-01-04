import React from 'react';
import {render} from 'react-dom';
import TableStock from './tableStock.jsx'

class Demo extends React.Component {
    render() {
        return(
            <div className="container">
                <h3>股票账户</h3>
                <TableStock url='/api/stocks' />
            </div>
        );
    }
}

render(
    <Demo />,
    document.getElementById('content')
);
