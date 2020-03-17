import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './Layout/Header';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Sales from './Pages/Sales';
import Stats from './Pages/Stats';

import '../App.css';

const App  = () => (
	<Router>
		<div className="App">
			{/* <Header /> */}
			<div className="App-content">
				<Route exact path="/" component={Login}/>
				<Switch>
					<Route exact path="/dashboard" component={Dashboard}/>
					<Route exact path="/sales" component={Sales}/>
					<Route exact path="/stats" component={Stats}/>
				</Switch>
			</div>
		</div>
	</Router>
)

/*
//ENUM of ws status
const CONN_STATUS = {
	CONNECTING: -1,
	DISCONNECTED: 0,
	CONNECTED: 1
};

class App extends React.Component {
	constructor(props) {
		super(props);

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
*/


export default App;
