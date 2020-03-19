import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

//ENUM of ws status


const Header = ({ ws }) => {
    const statusTag = (status) => {
        const WS_STATUS = {
            CONNECTING: -1,
            DISCONNECTED: 0,
            CONNECTED: 1
        };
        switch(status) {
            case WS_STATUS.CONNECTING:
                return (<span className="conn-status connecting">Connecting...</span>);
            case WS_STATUS.CONNECTED:
                return (<span className="conn-status connected">Connected</span>);
            case WS_STATUS.DISCONNECTED:
                return (<span className="conn-status disconnected">Disconnected</span>);
            default:
                return (<span>Disconnected</span>);
        }
    }

    return (
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
                {statusTag(ws.status)}
            </div>
        </header>
    );
}



const mapStateToProps = state => ({
    ws: state.ws
});

export default connect(mapStateToProps)(Header);