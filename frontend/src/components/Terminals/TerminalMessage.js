import React, {Component} from "react";
import Moment from "moment";


class TerminalMessage extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super()
    }

    render() {
        return (
            <tr key={this.props.index}>
                <td>
                    <img src={`/static/img/${window.messageTypes[this.props.message.messageTypeId][0]}`}
                         alt=""/>
                </td>
                <td>
                    <b>{Moment(this.props.message.dateTime).format('DD.MM.YYYY hh:mm:ss')}</b>
                </td>
                <td>
                    <b>Терминал №{this.props.terminal.id}</b>
                </td>
                <td>
                    {this.props.message.message}
                </td>
            </tr>
        );
    }
}

export default TerminalMessage