import React from 'react';
import Bots from '../../containers/Bots';
import OpenOrders from '../../containers/OpenOrders';
import OpenPositions from '../../containers/OpenPositions';
import Assets from '../../containers/Assets';

const Dashboard = () => (
    <div className="dashboard">

        <div className="cards">

            <Assets />

            <div className="tradesSummary widget">
                <div className="widget-body">
                    <div className="metric">
                        <span className="metric-title">Average return / trade</span>
                        <span className="metric-data large up">1.02%</span>
                    </div>
                    <div className="metric">
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th># Trades</th>
                                <th>Total returns</th>
                                <th>Average returns</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Today</td>
                                <td>1</td>
                                <td>-0.001215</td>
                                <td>-0.52%</td>
                            </tr>
                            <tr>
                                <td>Yesterday</td>
                                <td>2</td>
                                <td>0.002256</td>
                                <td>1.02%</td>
                            </tr>
                            <tr>
                                <td>This week</td>
                                <td>9</td>
                                <td>0.002256</td>
                                <td>1.02%</td>
                            </tr>
                        </tbody>
                    </table>
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

export default Dashboard;