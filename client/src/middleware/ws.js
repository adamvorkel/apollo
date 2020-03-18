import {
    WEBSOCKET_CONNECT,
    WEBSOCKET_DISCONNECT,
    WEBSOCKET_SEND
} from '../actions/types';

import {
    open,
    close,
    message,
    error
} from '../actions/ws';

const wsMiddleware = () => {
    console.log('middleware!')
    let socket = null;

    const onOpen = store => event => {
        console.log(`websocket open ${event.target.url}`);
        store.dispatch(open(event));
    };

    const onClose = store => event => {
        console.log(`websocket close`);
        store.dispatch(close(event));
    };

    const onMessage = store => event => {
        const action = JSON.parse(event.data);
        console.log(`websocket message ${action.payload}`);
        store.dispatch(message(event));
    };

    const onError = store => event => {
        console.log(`websocket error ${event.message}`);
        store.dispatch(error(event));
    };

    return store => next => action => {
        const { type, payload } = action;
        switch(type) {
            case WEBSOCKET_CONNECT:
                if(socket != null) socket.close();
                socket = new WebSocket(payload);
                socket.onopen = onOpen(store);
                socket.onclose = onClose(store);
                socket.onmessage = onMessage(store);
                socket.onerror = onError(store);
                break;
            case WEBSOCKET_DISCONNECT:
                if(socket != null) socket.close();
                socket = null;
                break;
            case WEBSOCKET_SEND:
                socket.send(JSON.stringify(payload));
                break;
            default:
                return next(action);
        }
        
    }
};

export default wsMiddleware();