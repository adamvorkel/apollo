import { connect } from 'react-redux';
import BotsList from '../components/BotsList';

const getVisibleBots = bots => {
    return bots;
}

const mapStateToProps = state => {
    return {
        bots: getVisibleBots(state.bots)
    };
}

const VisibleBotsList = connect(mapStateToProps, null)(BotsList);

export default VisibleBotsList;