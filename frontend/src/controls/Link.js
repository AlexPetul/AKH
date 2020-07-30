import React, {Component} from 'react'


class Link extends Component {

    render() {
        return (
            <div className={this.props.className}>
                <a className={this.props.linkClass} href={this.props.path}>{this.props.text}</a>
            </div>
        )
    }
}

export default Link