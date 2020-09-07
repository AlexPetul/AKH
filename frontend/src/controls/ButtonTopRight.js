import React, {Component} from 'react'


class ButtonTopRight extends Component {
    static defaultProps = {}

    render() {
        return (
            <div className="top__right">
                <a href="" onClick={e => {
                    e.preventDefault();
                    this.props.handleClick();
                }} className="button">{this.props.buttonText}</a>
            </div>
        )
    }
}

export default ButtonTopRight;