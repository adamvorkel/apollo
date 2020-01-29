import React, {Component} from 'react';
import Card from './Card';

class Cards extends Component {
    render() {
        return (
            <main className="cards">
                <Card />
                <Card />
                <div className="card big">
                    <h2>Card heading</h2>
                </div>
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