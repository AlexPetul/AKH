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
                        <div className="caption">{window.languageId === 1 ? "Терминал" : "Terminal"} №{this.props.terminal.id}</div>
                        <div className="row">

                            <TerminalCard
                                currentLanguage={this.props.currentLanguage}
                                terminal={this.props.terminal}
                            />

                            <TerminalDescription
                                currentLanguage={this.props.currentLanguage}
                                terminal={this.props.terminal}
                            />

                        </div>

                        <TerminalMessagesList
                            currentLanguage={this.props.currentLanguage}
                            terminal={this.props.terminal}
                        />

                        <TerminalCellsList
                            currentLanguage={this.props.currentLanguage}
                            terminal={this.props.terminal}
                        />

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default OwnerTerminalDetailed