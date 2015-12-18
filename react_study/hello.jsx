import React from 'react';
import {render} from 'react-dom';

class Hello extends React.Component {
	static defaultProps = { initialCount: 0}
	static propTypes = {initialCount: React.PropTypes.number}

	constructor(props) {
		super(props);
		this.state = {count: props.initialCount};
	}

	static propTypes = {
		count: React.PropTypes.number.isRequired
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

render(<Hello/>, document.getElementById('hello'));
