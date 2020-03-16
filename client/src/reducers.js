import { combineReducers } from 'redux';
import { ORDER_FILLED } from './actions';

function bots(state = [], action) {
    return state;
}

function openOrders(state = [], action) {
    switch(action.type) {
        case ORDER_FILLED:
            return Object.assign({}, state, {
                orders: state.orders.map(order => {
                    if(order.id === action.id) {
                        return Object.assign({}, order, {
                            filled: action.filled
                        })
                    }
                    return order;
                })
            });
        default:
            return state;
    }
}

function openPositions(state = [], action) {
    return state;
}

const rootReducer = combineReducers({
    bots,
    openOrders,
    openPositions
});

export default rootReducer;