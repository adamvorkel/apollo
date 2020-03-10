import React, {Component} from 'react';

class Bots extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // fetch("/api/bots")
        // .then(res => res.json())
        // .then(res => {
        //     this.setState({
        //         loaded: true,
        //         bots: res.bots
        //     });
        // }, error => {
        //     this.setState({
        //         loaded: true,
        //         error: error
        //     });
        // });
        
    }

    render() {
        return <h3>Active bots</h3>
    }
}

export default Bots;