import React from 'react';

const OpenPositionsList = ({openPositions}) => (
    <div className="widget">
        <div className="widget-header">
            <h3>Open positions</h3>
            <span className="widget-minimize">\/</span>
        </div>
        <div className="widget-body">
        <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Asset</th>
                        <th>Amount</th>
                        <th>Cost</th>
                        <th>Result</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {openPositions.map((position, index) => (
                        <tr key={index}>
                            <td>{position.id}</td>
                            <td>{position.asset}</td>
                            <td>{position.amount}</td>
                            <td>{position.cost}</td>
                            <td>{position.result}</td>
                            <td>{position.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default OpenPositionsList;