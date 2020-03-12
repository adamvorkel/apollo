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
                    <h3>Balance</h3>
                    <span className="metric-large">0.019256 BTC</span>
                    <table>
                        <tbody>
                            <tr>
                                <td>Free</td>
                                <td>0.014125 BTC</td>
                            </tr>
                            <tr>
                                <td>Tied</td>
                                <td>0.005131 BTC</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>

                <Card>
                    <h3>Pending Orders</h3>
                    <span className="metric-large">3 buys / 2 sells</span>
                </Card>
                
                <Card>
                    <h3>Hello</h3>
                </Card>

                <Card>
                    <h3>Hello</h3>
                </Card>

                <Card>
                    <Bots/>
                </Card>

                <Card>
                    <h3>Hello</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis ducimus voluptatum eius nam rem unde doloremque nemo voluptate illo nesciunt.</p>
                </Card>
            </main>
        )
    }
}

export default Cards;