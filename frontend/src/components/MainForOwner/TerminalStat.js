import React, {Component} from 'react'
import API from "../../services/api";
import TerminalsCount from "../Terminals/TerminalWidgets/TerminalsCount";
import OnlineTerminalsCount from "../Terminals/TerminalWidgets/OnlineTerminalsCount";
import ExpiredTerminalsCount from "../Terminals/TerminalWidgets/ExpiredTerminalsCount";
import WaitingTerminalsCount from "../Terminals/TerminalWidgets/WaitingTerminalsCount";
import ActiveTerminalsCount from "../Terminals/TerminalWidgets/ActiveTerminalsCount";
import BlockedTerminalsCount from "../Terminals/TerminalWidgets/BlockedTerminalsCount";
import {LOGIN_PATH} from "../../ContantUrls";


class TerminalStat extends Component {
    constructor() {
        super()
        this.state = {
            terminalsCount: 0,
            onlineTerminalsCount: 0,
            waitForActivationTerminalsCount: 0,
            expiredTokenTerminalsCount: 0,
            activeTerminalsCount: 0,
            blockedTerminalsCount: 0
        }
    }

    componentDidMount() {
        API.get("cabinetInfo")
            .then(result => {
                if (result.errorCode === 4) {
                    API.post("logout")
                        .then(result => {
                            localStorage.removeItem('token');
                            window.location = LOGIN_PATH;
                        })
                } else {
                    this.setState({
                        terminalsCount: result.data.data[0].value,
                        activeTerminalsCount: result.data.data[1].value,
                        blockedTerminalsCount: result.data.data[2].value,
                        onlineTerminalsCount: result.data.data[3].value,
                        waitForActivationTerminalsCount: result.data.data[4].value,
                        expiredTokenTerminalsCount: result.data.data[5].value
                    })
                }
            })
            .catch(error => console.log('error', error));
    }

    render() {
        return (
            <div className="main main-5-col">
                <div className="main__row">

                    <TerminalsCount
                        icon={window.totalTerminalsIcon}
                        text={window.totalTerminalsText}
                        count={this.state.terminalsCount}
                    />

                    <ActiveTerminalsCount
                        icon={window.activeTerminalsIcon}
                        text={window.activeTerminalsText}
                        count={this.state.activeTerminalsCount}
                    />

                    <BlockedTerminalsCount
                        icon={window.blockedTerminalsIcon}
                        text={window.blockedTerminalsText}
                        count={this.state.blockedTerminalsCount}
                    />

                    <OnlineTerminalsCount
                        icon={window.onlineTerminalsIcon}
                        text={window.onlineTerminalsText}
                        count={this.state.onlineTerminalsCount}
                    />

                    <WaitingTerminalsCount
                        icon={window.pendingTerminalsIcon}
                        text={window.pendingTerminalsText}
                        count={this.state.waitForActivationTerminalsCount}
                    />

                    <ExpiredTerminalsCount
                        icon={window.expiredTerminalsIcon}
                        text={window.expiredTerminalsText}
                        count={this.state.expiredTokenTerminalsCount}
                    />

                </div>
            </div>
        )
    }
}

export default TerminalStat