import React from 'react';

const BotsList = ({bots}) => (
    <div className="bots widget">
        <div className="widget-header">
            <h3>Bots</h3>
            <div className="widget-tabs">
                <button className="tab active">Realtime</button>
                <button className="tab">Paper</button>
            </div>
        </div>
        <div className="widget-body">
            
            <table>
                <thead>
                    <tr>
                        <th>Age</th>
                        <th>Asset</th>
                        <th>Ticker</th>
                        <th>Strategy</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bots.map((bot, index) => (
                        <tr key={index}>
                            <td>{bot.uptime}</td>
                            <td>{bot.asset}</td>
                            <td>{bot.ticker}</td>
                            <td>{bot.strategy}</td>
                            <td>{bot.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
    </div>
);

export default BotsList;