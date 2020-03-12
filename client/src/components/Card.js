import React, {Component} from 'react';

class Card extends Component {
    

    render() {
        if(this.props.children) {
            return (
                <div className="card">
                    {this.props.children}
                </div>
            )
        } else {
            return (
                <div className="card">
                    <h3>Empty card</h3>
                </div>
            )
        }
        
    }
}

export default Card;