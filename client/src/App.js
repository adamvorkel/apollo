import React from 'react';

import Cards from './Cards';

import logo from './logo.svg';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ws: null
		};
	}

	componentDidMount() {
		let ws = new WebSocket("ws://localhost:3001");
		ws.onopen = event => {
			this.setState({ws:ws});
		}
	}

	render() {
		const {ws} = this.state;

		let wsConnected;
		if(ws) {
			wsConnected = <p>Connected!</p>
		} else {
			wsConnected = <p>Disconnected...</p>
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
							<li>{wsConnected}</li>
						</ul>
					</nav>
					</div>
				</header>
				<div className="App-content">
					<aside className="sidebar">
						<h2>Sidebar</h2>
						<p>Some content will go here</p>
					</aside>
					<Cards />
				</div>
	
			</div>
		);
	}
}



export default App;
