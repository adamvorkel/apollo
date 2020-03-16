import { connect } from 'react-redux';
import OpenOrdersList from '../components/OpenOrdersList';

const poop = orders => {
    return orders;
}

const mapStateToProps = state => {
    return {
        openOrders: poop(state.openOrders)
    };
};

const OpenOrders = connect(mapStateToProps, null)(OpenOrdersList);

export default OpenOrders;
