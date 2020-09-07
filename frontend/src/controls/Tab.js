import React, {Component} from 'react'


class Tab extends Component {
    static defaultProps = {}

    render() {
        return (
            <button onClick={e => {
                e.preventDefault();
                this.props.handleClick(this.props.index);
            }}
                    className={this.props.className}>{this.props.tabText}
            </button>
        )
    }
}

export default Tab;