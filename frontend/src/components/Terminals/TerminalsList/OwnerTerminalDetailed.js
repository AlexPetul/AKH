import React, {Component} from 'react'
import TerminalCard from "./TerminalCard";
import TerminalDescription from "./TerminalDescription";
import TerminalMessagesList from "./TerminalMessagesList";
import TerminalCellsList from "./TerminalCellsList";


class OwnerTerminalDetailed extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <React.Fragment>
                <div className="content">
                    <div className="container terminal-data">
                        <div className="caption">Терминал №{this.props.terminal.id}</div>
                        <div className="row">

                            <TerminalCard
                                terminal={this.props.terminal}
                            />

                            <TerminalDescription
                                terminal={this.props.terminal}
                            />

                        </div>

                        <TerminalMessagesList
                            terminal={this.props.terminal}
                        />

                        <TerminalCellsList
                            terminal={this.props.terminal}
                        />

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default OwnerTerminalDetailed