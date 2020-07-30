import React, {Component} from 'react'


class Title extends Component {
    render() {
        return (
            <div className={this.props.titleStyles}>
                {this.props.titleText}
            </div>
        )
    }
}

export default Title

