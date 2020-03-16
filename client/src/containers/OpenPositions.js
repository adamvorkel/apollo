import { connect } from 'react-redux';
import OpenPositionsList from '../components/OpenPositionsList';

const poop = positions => {
    return positions;
}

const mapStateToProps = state => {
    return {
        openPositions: poop(state.openPositions)
    };
}

const OpenPositions = connect(mapStateToProps, null)(OpenPositionsList);

export default OpenPositions;