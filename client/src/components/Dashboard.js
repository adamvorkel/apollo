import React, {Component} from 'react';
import Bots from '../containers/Bots';
import OpenOrders from '../containers/OpenOrders';
import OpenPositions from '../containers/OpenPositions';
import Assets from '../containers/Assets';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="dashboard">

                <div className="cards">
                    <Assets />
                    <div className="widget">
                        <div className="widget-body">
                            <div className="metric">
                                <span className="metric-title">Summary Yesterday</span>
                                <span className="metric-data">2 trades</span>
                                <span className="metric-data up">0.002256 return</span>
                                <span className="metric-data up">1.02%</span>
                            </div>
                            <div className="metric">
                                <span className="metric-title">Summary This week</span>
                                <span className="metric-data">9 trades</span>
                                <span className="metric-data up">0.002256 return</span>
                                <span className="metric-data up">1.02%</span>
                            </div>
                            <div className="metric">
                                <span className="metric-title">Average return / trade</span>
                                <span className="metric-data up">1.02%</span>
                            </div>
                        </div>


                    </div>
                    <div className="widget">
                        <div className="widget-body">
                            <div className="metric">
                                <span className="metric-title">BTC Price</span>
                                <span className="metric-data large down">$9891 (-3.42%)</span>
                            </div>
                            <div className="metric">
                                <span className="metric-title">Biggest movers</span>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>EOS</td>
                                            <td>0.001241</td>
                                            <td>5.42%</td>
                                        </tr>
                                        <tr>
                                            <td>XRP</td>
                                            <td>0.001241</td>
                                            <td>5.42%</td>
                                        </tr>
                                        <tr>
                                            <td>ETC</td>
                                            <td>0.001241</td>
                                            <td>5.42%</td>
                                        </tr>
                                        <tr>
                                            <td>ETC</td>
                                            <td>0.001241</td>
                                            <td>5.42%</td>
                                        </tr>
                                        <tr>
                                            <td>ETC</td>
                                            <td>0.001241</td>
                                            <td>5.42%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <OpenOrders />
                <OpenPositions />
                <Bots />
            </div>
        )
    }
}

export default Dashboard;