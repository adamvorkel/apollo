import React from 'react';
import ReactDOM, { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

const hydrateState = () => {
    return {
        bots: [
            {uptime: 3, asset: 'EOS', ticker: 0.2135, strategy: 'STOCH-BOLL', status: 'active'},
            {uptime: 1, asset: 'LTC', ticker: 0.2135, strategy: 'RSI-BOLL', status: 'preparing'},
            {uptime: 2, asset: 'XRP', ticker: 0.2135, strategy: 'STOCH-BOLL', status: 'active'},
            {uptime: 2, asset: 'XLM', ticker: 0.2135, strategy: 'STOCH-BOLL', status: 'active'},
        ],
        openOrders: [
            {id: 11, asset: 'EOS', type: 'buy', amount: 5, age: 1},
            {id: 12, asset: 'LTC', type: 'sell', amount: 22, age: 5},
            {id: 13, asset: 'XRP', type: 'sell', amount: 1, age: 2},
            {id: 14, asset: 'XLM', type: 'buy', amount: 11, age: 2},
        ],
        openPositions: [
            {id: 34, asset: 'EOS', amount: 12, cost: 0.001265, result: 1.26, age: 1}
        ]
    }
}

const store = createStore(rootReducer, hydrateState());

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
