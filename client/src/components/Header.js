import React, {Component} from 'react';
// import logo from '../logo.svg';

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // const connStatus = this.props.connStatus;
        return (
            <header className="App-header">
                <div className="App-header-container">				
                    {/* <img src={logo} className="App-logo" alt="logo" /> */}
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
                    {/* <span className={"conn-status " + connStatus.className}>{connStatus.message}</span> */}
                </div>
            </header>
        )
    }
}

export default Header;