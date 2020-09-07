import React, {Component} from 'react'
import API from "../../services/api";
import TerminalsCount from "../Terminals/TerminalWidgets/TerminalsCount";
import OnlineTerminalsCount from "../Terminals/TerminalWidgets/OnlineTerminalsCount";
import ExpiredTerminalsCount from "../Terminals/TerminalWidgets/ExpiredTerminalsCount";
import WaitingTerminalsCount from "../Terminals/TerminalWidgets/WaitingTerminalsCount";
import ActiveTerminalsCount from "../Terminals/TerminalWidgets/ActiveTerminalsCount";
import BlockedTerminalsCount from "../Terminals/TerminalWidgets/BlockedTerminalsCount";
import {LOGIN_PATH} from "../../ContantUrls";
import PaymentCount from "../Terminals/TerminalWidgets/PaymentCount";
import StoragesCount from "../Terminals/TerminalWidgets/StoragesCount";
import CollectionsCount from "../Terminals/TerminalWidgets/CollectionsCount";
import CellAttachmentsCount from "../Terminals/TerminalWidgets/CellAttachmentsCount";
import TotalMarks from "../Terminals/TerminalWidgets/TotalMarks";


class TerminalStat extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            cabinetInfo: [],
            currentLanguage: currentLanguage,
            configId: 0
        }
    }

    componentDidMount() {
        API.get("cabinetInfo")
            .then(result => {
                console.log(result.data.data);
                if (result.errorCode === 4) {
                    API.post("logout")
                        .then(result => {
                            localStorage.removeItem('token');
                            window.location = LOGIN_PATH;
                        })
                } else {
                    API.get('getTerminalGroups')
                        .then(response => {
                            let configId = response.data.data.list[0].configurationId;
                            this.setState({
                                cabinetInfo: result.data.data,
                                configId: configId
                            });
                        });
                }
            })
            .catch(error => console.log('error', error));
    }

    render() {
        return (
            <div className="main main-4-col">
                <div className="main__row">

                    {this.state.cabinetInfo.map((cabInfo) =>
                        cabInfo.id === 6
                            ?
                            <TerminalsCount
                                icon={window.totalTerminalsIcon}
                                text={window.pageContent['total_terminals_text'][this.state.currentLanguage]}
                                count={cabInfo.value}
                            />
                            :
                            null
                    )}

                    {this.state.cabinetInfo.map((cabInfo) =>
                        cabInfo.id === 7
                            ?
                            <ActiveTerminalsCount
                                icon={window.activeTerminalsIcon}
                                text={window.pageContent['active_terminals_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[1].value}
                            />
                            :
                            null
                    )}

                    {this.state.cabinetInfo.map((cabInfo) =>
                        cabInfo.id === 8
                            ?
                            <BlockedTerminalsCount
                                icon={window.blockedTerminalsIcon}
                                text={window.pageContent['blocked_terminals_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[2].value}
                            />
                            :
                            null
                    )}

                    {this.state.cabinetInfo.map((cabInfo) =>
                        cabInfo.id === 9
                            ?
                            <OnlineTerminalsCount
                                icon={window.onlineTerminalsIcon}
                                text={window.pageContent['online_terminals_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[3].value}
                            />
                            :
                            null
                    )}

                    {this.state.cabinetInfo.map((cabInfo) =>
                        cabInfo.id === 10
                            ?
                            <WaitingTerminalsCount
                                icon={window.pendingTerminalsIcon}
                                text={window.pageContent['pending_terminals_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[4].value}
                            />
                            :
                            null
                    )}

                    {this.state.cabinetInfo.map((cabInfo) =>
                        cabInfo.id === 11
                            ?
                            <ExpiredTerminalsCount
                                icon={window.expiredTerminalsIcon}
                                text={window.pageContent['expired_terminals_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[5].value}
                            />
                            :
                            null
                    )}

                    {this.state.configId === 1
                        ?
                        <React.Fragment>
                            <PaymentCount
                                icon={window.paymentsIcon}
                                text={window.pageContent['payments_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[6].value}
                            />

                            <StoragesCount
                                icon={window.storagesIcon}
                                text={window.pageContent['storage_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[7].value}
                            />

                            <CollectionsCount
                                icon={window.collectionsIcon}
                                text={window.pageContent['collections_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[8].value}
                            />
                        </React.Fragment>
                        :
                        null}

                    {this.state.configId === 2
                        ?
                        <CellAttachmentsCount
                            icon={window.cellAttachmentsIcon}
                            text={window.pageContent['cell_attachments_text'][this.state.currentLanguage]}
                            count={this.state.cabinetInfo[6].value}
                        />
                        :
                        null}

                    {this.state.configId === 3
                        ?
                        <React.Fragment>
                            <PaymentCount
                                icon={window.paymentsIcon}
                                text={window.pageContent['payments_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[6].value}
                            />

                            <StoragesCount
                                icon={window.storagesIcon}
                                text={window.pageContent['storage_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[7].value}
                            />

                            <TotalMarks
                                icon={window.markIcon}
                                text={window.pageContent['mark_text'][this.state.currentLanguage]}
                                count={this.state.cabinetInfo[8].value}
                            />
                        </React.Fragment>
                        :
                        null}

                </div>
            </div>
        )
    }
}

export default TerminalStat