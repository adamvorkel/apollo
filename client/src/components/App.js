import React from 'react';
import Header from './Header';
import Cards from './Cards';

import logo from '../logo.svg';
import '../App.css';

//ENUM of ws status
const CONN_STATUS = {
	CONNECTING: -1,
	DISCONNECTED: 0,
	CONNECTED: 1
};

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ws: null,
			status: CONN_STATUS.CONNECTING,
			error: null,
		};
	}

	componentDidMount() {
		let ws = new WebSocket("ws://localhost:3001");

		ws.onopen = event => {
			this.setState({
				ws:ws,
				status: CONN_STATUS.CONNECTED
			});
		};

		ws.onerror = err => {
			this.setState({
				ws:null, 
				status: CONN_STATUS.DISCONNECTED,
				error: "can't connect"
			});
		};

		ws.onmessage = message => {
			let data;
			try {
				data = JSON.parse(message.data);
			} catch(err) {
				data = {};
				console.log("Error parsing message");
			}
	
			if(data.event === 'state') {
				console.log(data.payload);
			}
		}

		ws.onclose = event => {
			this.setState({
				ws:null,
				status: CONN_STATUS.DISCONNECTED
			});
		};
	}

	render() {
		const {status, error} = this.state;

		let connStatus;

		switch(status) {
			case CONN_STATUS.CONNECTING: {
				connStatus = {
					className: 'connecting',
					message: 'Connecting...'
				};
				break;
			}
			case CONN_STATUS.CONNECTED: {
				connStatus = {
					className: 'connected',
					message: 'Connected'
				};
				break;
			}
			case CONN_STATUS.DISCONNECTED: {
				connStatus = {
					className: 'disconnected',
					message: 'Disconnected'
				};
				break;
			}
		}
		return (
			<div className="App">
				<Header connStatus={connStatus}/>
				<div className="App-content">
					<Cards />
				</div>
			</div>
		);
	}
}



export default App;
