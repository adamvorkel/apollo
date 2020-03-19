import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { connect as wsconnect } from '../actions/ws';

import Header from './Layout/Header';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Sales from './Pages/Sales';
import Stats from './Pages/Stats';

import '../App.css';

class App extends Component {
	componentDidMount() {
		const { wsconnect } = this.props;
		wsconnect('ws://localhost:3001');
	}

	render() {
		return (
			<Router>
				<div className="App">
					<Header />
					<div className="App-content">
						<Route exact path="/" component={Login} />
						<Switch>
							<Route exact path="/dashboard" component={Dashboard} />
							<Route exact path="/sales" component={Sales} />
							<Route exact path="/stats" component={Stats} />
						</Switch>
					</div>
				</div>
			</Router>
		)
	}
}

/*
//ENUM of ws status
const CONN_STATUS = {
	CONNECTING: -1,
	DISCONNECTED: 0,
	CONNECTED: 1
};

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

// const mapStateToProps = state => {
// 	return {

// 	}
// }

export default connect(null, { wsconnect })(App);
