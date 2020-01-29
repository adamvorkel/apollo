import React, {Component} from 'react';

class Bots extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loaded: false,
            bots: []
        }
    }

    componentDidMount() {
        fetch("/api/bots")
        .then(res => res.json())
        .then(res => {
            this.setState({
                loaded: true,
                bots: res.bots
            });
        }, error => {
            this.setState({
                loaded: true,
                error: error
            });
        });
    }

    render() {
        const {error, loaded, bots} = this.state;
        const numBotsActive = bots.length;

        if(!loaded) {
            return <p>Loading ...</p>
        } else {
            if(error) {
                return <p>Error...{error.message}</p>
            }

            if(numBotsActive) {
                return (
                    
                    <ul>
                        <li>{numBotsActive} active</li>
                        {bots.map(bot => (
                            <li key={bot.id}>
                                Bot - mode: {bot.mode} | start: {bot.start}
                            </li>
                        ))}
                    </ul>
                )
            } else {
                return <p>No bots active</p>
            }

            
        }
    }
}

export default Bots;