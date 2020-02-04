import React, {Component} from 'react';
import Card from './Card';
import Bots from './Bots';

class Cards extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className="cards">
                <Card>
                    <Bots bots={this.props.bots}/>
                </Card>
                <Card />
                
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </main>
        )
    }
}

export default Cards;