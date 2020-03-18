/**
 * action creators
*/

import {
    WEBSOCKET_CONNECT,
    WEBSOCKET_DISCONNECT,
    WEBSOCKET_SEND,
    WEBSOCKET_OPEN,
    WEBSOCKET_CLOSE,
    WEBSOCKET_MESSAGE,
    WEBSOCKET_ERROR
} from './types';

export const connect = url => {
    return {
        type: WEBSOCKET_CONNECT,
        payload: url
    };
};

export const disconnect = url => {
    return {
        type: WEBSOCKET_DISCONNECT
    };
};

export const send = message => {
    return {
        type: WEBSOCKET_SEND,
        payload: message
    };
};

export const open = event => {
    return {
        type: WEBSOCKET_OPEN,
        payload: event
    };
}

export const close = event => {
    return {
        type: WEBSOCKET_CLOSE,
        payload: event
    };
};

export const message = event => {
    return {
        type: WEBSOCKET_MESSAGE,
        payload: event
    };
};

export const error = event => {
    return {
        type: WEBSOCKET_ERROR,
        payload: event
    }
}