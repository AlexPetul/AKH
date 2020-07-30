import React, {Component, useState} from 'react'
import API from "../../services/api";
import TerminalsCount from "../../components/Terminals/TerminalWidgets/TerminalsCount";
import OnlineTerminalsCount from "../../components/Terminals/TerminalWidgets/OnlineTerminalsCount";
import WaitingTerminalsCount from "../../components/Terminals/TerminalWidgets/WaitingTerminalsCount";
import ExpiredTerminalsCount from "../../components/Terminals/TerminalWidgets/ExpiredTerminalsCount";
import TerminalGroupsCount from "../../components/Terminals/TerminalWidgets/TerminalGroupsCount";
import {LOGIN_PATH} from "../../ContantUrls";


class MainAdminContainer extends Component {
    constructor() {
        super()

        this.state = {
            terminalGroupsCount: 0,
            terminalsCount: 0,
            onlineTerminalsCount: 0,
            waitForActivationTerminalsCount: 0,
            expiredTokenTerminalsCount: 0,
        }
    }

    componentDidMount() {
        API.get("cabinetInfo")
            .then(response => response.json())
            .then(result => {
                if (result.errorCode === 4) {
                    API.post("logout")
                        .then(result => {
                            localStorage.removeItem('token');
                            window.location = LOGIN_PATH;
                        })
                } else {
                    this.setState({
                        terminalGroupsCount: result.data[0].value,
                        terminalsCount: result.data[1].value,
                        onlineTerminalsCount: result.data[2].value,
                        waitForActivationTerminalsCount: result.data[3].value,
                        expiredTokenTerminalsCount: result.data[4].value
                    })
                }
            })
            .catch(error => console.log('error', error));
    }

    render() {

        return (
            <div className="content">
                <div className="container">
                    <div className="caption">
                        Общая информация
                    </div>

                    <div className="main">
                        <div className="main__row">

                            <TerminalGroupsCount
                                icon={window.totalTerminalsGroupsIcon}
                                text={window.totalTerminalsGroupsText}
                                count={this.state.terminalGroupsCount}
                            />

                            <TerminalsCount
                                icon={window.totalTerminalsIcon}
                                text={window.totalTerminalsText}
                                count={this.state.terminalsCount}
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

                </div>
            </div>
        )
    }
}

export default MainAdminContainer