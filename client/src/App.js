import React from 'react';

import Cards from './Cards';

import logo from './logo.svg';
import './App.css';

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
			bots: []
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
			let payload;
			try {
				payload = JSON.parse(message.data);
			} catch(err) {
				payload = {};
				console.log("Error parsing message");
			}

			if(payload.event === 'botStarted') {
				this.setState(state => {
					const list = [...state.bots, payload.payload];
					return {
						bots: list
					}
				})
				console.log(this.state)
				
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



		if(error) {
		}

		return (
			<div className="App">
				<header className="App-header">
					<div className="App-header-container">
	

					
					<img src={logo} className="App-logo" alt="logo" />
					<nav className="App-nav">
						<ul>
							<li><a href="#">Dashboard</a></li>
							<li><a href="#">Watching</a></li>
							<li><a href="#">Pending</a></li>
							<li><a href="#">Open</a></li>
							<li><a href="#">Sales</a></li>
							<li><a href="#">Stats</a></li>
							<li><span className={"conn-status " + connStatus.className}>{connStatus.message}</span></li>
						</ul>
					</nav>
					</div>
				</header>
				<div className="App-content">
					<aside className="sidebar">
						<h2>Sidebar</h2>
						<p>Some content will go here</p>
					</aside>
					<Cards bots = {this.state.bots} />
				</div>
	
			</div>
		);
	}
}



export default App;
