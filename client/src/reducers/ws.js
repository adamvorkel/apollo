import {
    WEBSOCKET_CONNECT,
    WEBSOCKET_OPEN,
    WEBSOCKET_CLOSE
} from '../actions/types';


//ENUM of ws status
const WS_STATUS = {
	CONNECTING: -1,
	DISCONNECTED: 0,
	CONNECTED: 1
};

const initialState = {
    status: WS_STATUS.CONNECTING
};

export default (state = initialState, action) => {
    const { type } = action;
    switch(type) {
        case WEBSOCKET_CONNECT:
            return { status: WS_STATUS.CONNECTING }
        case WEBSOCKET_OPEN:
            return { status: WS_STATUS.CONNECTED };
        case WEBSOCKET_CLOSE:
            return { status: WS_STATUS.DISCONNECTED };
        default:
            return state;
    }
}