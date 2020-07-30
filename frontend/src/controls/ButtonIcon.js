import React, {Component} from 'react'


class ButtonIcon extends Component {
    static defaultProps = {}

    render() {
        return (
            <div className="tooltip buttons__item" title={this.props.title}>
                <a
                    href=""
                    className={this.props.className}
                    onClick={this.props.handleClick}
                />
            </div>
        )
    }
}

export default ButtonIcon