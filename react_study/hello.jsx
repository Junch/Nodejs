import React from 'react';
import {render} from 'react-dom';

class Hello extends React.Component {
	render() {
		return <h1>Hello</h1>
	}

	componentWillMount() {
		console.log('Hello will');
	}

	componentDidMount() {
		console.log('Hello did');
	}
}

render(<Hello/>, document.getElementById('hello'));
