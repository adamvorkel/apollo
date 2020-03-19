import { combineReducers } from 'redux';
import ws from './ws';
import alert from './alert';

const rootReducer = combineReducers({
    ws, 
    alert
});

export default rootReducer;