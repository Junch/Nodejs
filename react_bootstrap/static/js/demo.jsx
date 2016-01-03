import React from 'react';
import {render} from 'react-dom';
import { Button } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import AlertAutoDismissable from './alertAutoDismissable.jsx'
import TableDemo from './tableDemo.jsx'

class Demo extends React.Component {
    render() {
        return(
            <div>
				<AlertAutoDismissable />

                <Alert bsStyle="warning">
                    <strong>Holy guacamole!</strong> Best check yo self, you're not looking too good.
                </Alert>

                <TableDemo url='/api/users' />

                <Button bsStyle="success" bsSize="small">
                  Click me
                </Button>
            </div>
        );
    }
}

render(
    <Demo />,
    document.getElementById('content')
);
