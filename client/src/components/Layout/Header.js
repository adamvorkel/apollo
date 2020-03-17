import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
    // const connStatus = this.props.connStatus;
    <header className="App-header">
        <div className="App-header-container">				
            <nav className="App-nav">
                <ul>
                    <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                    <li><NavLink to="/sales">Sales</NavLink></li>
                    <li><NavLink to="/stats">Stats</NavLink></li>
                </ul>
            </nav>
            {/* <span className={"conn-status " + connStatus.className}>{connStatus.message}</span> */}
        </div>
    </header>
)

export default Header;