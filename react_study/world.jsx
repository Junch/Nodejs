import React from 'react';
import {render} from 'react-dom';

class World extends React.Component {
	render() {
		return <h1 style={{opacity: this.state.opacity, fontSize: this.state.fontSize}}>World</h1>
	}

	constructor() {
		super();
		this.state = {
			opacity: 1.0,
			fontSize: '12px'
		}
	}

	componentWillMount() {
		alert('will');
		console.log('World will');
	}

	componentDidMount() {
		alert('did');
		console.log('World did');

		var _self = this;
		window.setTimeout(()=>{
			_self.setState({
				opacity: 0.5,
				fontSize: '44px'
			})},
			1000
		);
	}
}

render(<World/>, document.getElementById('world'));
