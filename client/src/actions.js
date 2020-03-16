/**
 * Action Types
 */

export const ORDER_FILLED = 'ORDER_FILLED';

/**
 * Action Creators
 */


 export function orderFilled(id, filled) {
     return { type: ORDER_FILLED, id, filled };
 }