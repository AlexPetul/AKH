import React, {Component, useState} from 'react'
import API from "../../services/api";
import TerminalsCount from "../../components/Terminals/TerminalWidgets/TerminalsCount";
import OnlineTerminalsCount from "../../components/Terminals/TerminalWidgets/OnlineTerminalsCount";
import WaitingTerminalsCount from "../../components/Terminals/TerminalWidgets/WaitingTerminalsCount";
import ExpiredTerminalsCount from "../../components/Terminals/TerminalWidgets/ExpiredTerminalsCount";
import TerminalGroupsCount from "../../components/Terminals/TerminalWidgets/TerminalGroupsCount";
import {LOGIN_PATH} from "../../ContantUrls";
import logoutFromSuperAdmin from "../../components/Account/LogoutFromContext";


class MainAdminContainer extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            terminalGroupsCount: 0,
            terminalsCount: 0,
            onlineTerminalsCount: 0,
            waitForActivationTerminalsCount: 0,
            expiredTokenTerminalsCount: 0,
        }
    }

    componentDidMount() {
        if (localStorage.getItem('context_id')) {
            logoutFromSuperAdmin();
        }

        API.get("cabinetInfo")
            .then(result => {
                if (result.data.errorCode === 4) {
                    API.post("logout")
                        .then(result => {
                            localStorage.removeItem('token');
                            window.location = LOGIN_PATH;
                        })
                } else {
                    console.log(result);
                    this.setState({
                        terminalGroupsCount: result.data.data[0].value,
                        terminalsCount: result.data.data[1].value,
                        onlineTerminalsCount: result.data.data[2].value,
                        waitForActivationTerminalsCount: result.data.data[3].value,
                        expiredTokenTerminalsCount: result.data.data[4].value
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
                        {window.pageContent['page_header'][this.state.currentLanguage]}
                    </div>

                    <div className="main">
                        <div className="main__row">

                            <TerminalGroupsCount
                                icon={window.totalTerminalsGroupsIcon}
                                text={window.pageContent['total_terminals_groups_text'][this.state.currentLanguage]}
                                count={this.state.terminalGroupsCount}
                            />

                            <TerminalsCount
                                icon={window.totalTerminalsIcon}
                                text={window.pageContent['total_terminals_text'][this.state.currentLanguage]}
                                count={this.state.terminalsCount}
                            />

                            <OnlineTerminalsCount
                                icon={window.onlineTerminalsIcon}
                                text={window.pageContent['online_terminals_text'][this.state.currentLanguage]}
                                count={this.state.onlineTerminalsCount}
                            />

                            <WaitingTerminalsCount
                                icon={window.pendingTerminalsIcon}
                                text={window.pageContent['pending_terminals_text'][this.state.currentLanguage]}
                                count={this.state.waitForActivationTerminalsCount}
                            />

                            <ExpiredTerminalsCount
                                icon={window.expiredTerminalsIcon}
                                text={window.pageContent['expired_terminals_text'][this.state.currentLanguage]}
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