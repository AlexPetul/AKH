import React, {Component} from 'react'


class FilterTitle extends Component {
    static defaultProps = {};

    render() {
        return (
            <div className="label-input">
                {this.props.titleText}
            </div>
        )
    }
}

export default FilterTitle;