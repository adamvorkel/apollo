import React from 'react';

import Cards from './Cards';

import logo from './logo.svg';
import './App.css';

function App() {
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

export default App;
