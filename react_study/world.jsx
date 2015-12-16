import React from 'react';
import {render} from 'react-dom';

class World extends React.Component {
	render() {
		return <h1>World</h1>
	}
}

render(<World/>, document.getElementById('world'));
