import React from 'react';

const AssetsList =  ({assets}) => (
    <div className="assets widget">
        <div className="widget-body">
            <div className="metric">
                <span className="metric-title">BTC Total</span>
                <span className="metric-data large">0.019256</span>
                <span className="metric-data">0.019256 Balance</span>
                <span className="metric-data">0.019256 Invested</span>
            </div>
            <div className="metric">
                <span className="metric-title">BTC Returns</span>
                <span className="metric-data large up">0.002256 (17.71%)</span>
                <span className="metric-data">0.019256 Start</span>
            </div>
        </div>
    </div>
);

export default AssetsList;
    
