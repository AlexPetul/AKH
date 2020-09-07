import React, {Component} from "react";
import Moment from "moment";


class TerminalMessage extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super()
    }

    render() {
        return (
            <React.Fragment>
                <tr>
                    <td>
                        <img src={`/static/img/${window.messageTypes[this.props.message.messageTypeId][0]}`}
                             alt=""/>
                    </td>
                    <td>
                        <b>{Moment(this.props.message.dateTime).format('DD.MM.YYYY hh:mm:ss')}</b>
                    </td>
                    {this.props.displayNumber
                        ?
                        <td>
                            <b>Терминал №{this.props.terminal.id}</b>
                        </td>
                        :
                        null
                    }
                    <td>
                        {this.props.message.message}
                    </td>
                </tr>
            </React.Fragment>
        );
    }
}

export default TerminalMessage