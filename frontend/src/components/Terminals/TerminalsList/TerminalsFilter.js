import React, {Component} from 'react'


class TerminalsFilter extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="select">
                <select onChange={this.props.handleChange}>
                    {this.props.statuses.map((status, index) =>
                        (index === 0)
                            ?
                            <React.Fragment key={index}>
                                <option id="all" defaultChecked={true}
                                        key="all">{this.props.filterAllText}</option>
                                <option id={status.id} key={status.id}>{status.name}</option>
                            </React.Fragment>
                            :
                            (status.id !== 305) ?
                                <option id={status.id}
                                        key={status.id}>{status.name}</option> : null
                    )}
                </select>
            </div>
        )
    }
}

export default TerminalsFilter;