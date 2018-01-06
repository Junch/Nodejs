import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types'

class Hello extends React.Component {
	constructor(props) {
		super(props);
		this.state = {count: props.initialCount};
	}

	tick() {
		this.setState({count: this.state.count + 1});
	}

	render() {
		return <h1 onClick={this.tick.bind(this)}>Hello: {this.state.count}</h1>
	}

	componentWillMount() {
		console.log('Hello will');
	}

	componentDidMount() {
		console.log('Hello did');
	}
}

Hello.defaultProps = {
	initialCount: 0
};

Hello.propTypes = {
 	initialCount: PropTypes.number
};

render(<Hello/>, document.getElementById('hello'));
