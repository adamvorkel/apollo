import React from 'react';

const OpenOrdersList = ({openOrders}) => (
    <div className="openOrders widget">
        <div className="widget-header">
            <h3>Open orders</h3>
            <span className="widget-minimize">\/</span>
        </div>
        
        <div className="widget-body">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Asset</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {openOrders.map((order, index) => (
                        <tr key={index}>
                            <td>{order.id}</td>
                            <td>{order.asset}</td>
                            <td>{order.type}</td>
                            <td>{order.amount}</td>
                            <td>{order.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        

            

    </div>
);

export default OpenOrdersList;