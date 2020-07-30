import React, {Component, useState} from 'react'
import API from "../../services/api";
import TerminalMessagesContainer from "../../components/MainForOwner/TerminalMessages";
import TerminalStat from "../../components/MainForOwner/TerminalStat";
import Loader from "../../controls/Loader";
import {OWNER_CONFIGURATION} from "../../ContantUrls";


class CommonContainer extends Component {
    constructor() {
        super()

        this.state = {
            showLoader: false,
            terminalGroupsCount: 0,
            terminalsCount: 0,
            onlineTerminalsCount: 0,
            waitForActivationTerminalsCount: 0,
            expiredTokenTerminalsCount: 0,
            configuration: "",
            configurations: [],
            containerIndex: 0,
            isGroupEmpty: true
        }
    }

    componentDidMount() {
        let contextId = localStorage.getItem('context_id');
        this.setState({showLoader: true}, () => {
            API.get("getTerminalGroups", {
                params: {
                    id: contextId
                }
            })
                .then(response => response.data)
                .then(responseJson => {
                    const currentConfig = responseJson.data.list[0].configurationId;
                    if (currentConfig !== 0) {
                        this.setState({isGroupEmpty: false});
                    }
                    API.get('getDictionary', {
                        params: {
                            name: 'configurations'
                        }
                    })
                        .then(response => {
                            let configurations = response.data.data;
                            this.setState({
                                configurations: configurations,
                                configuration: currentConfig,
                                showLoader: false
                            });
                        });
                })
        });
    }

    changeTab(containerIndex) {
        this.setState({
            containerIndex: containerIndex
        })
    }

    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="caption">
                        {window.pageHeader}: <span className="caption__span">
                        {this.state.configurations.map((config) =>
                            config.id === this.state.configuration ? config.name : null
                        )}
                    </span>
                        {this.state.isGroupEmpty
                            ?
                            <button onClick={e => {
                                e.stopPropagation();
                                window.location = OWNER_CONFIGURATION;
                            }} className="caption__btn">{window.changeConfigButton}
                            </button>
                            :
                            null
                        }
                    </div>
                    <div className="tabsBtn">
                        <button onClick={e => {
                            e.stopPropagation();
                            this.changeTab(0)
                        }}
                                className={`tabsBtn__btn ${this.state.containerIndex ? "" : "tabsBtn__btn-active"}`}>{window.statTab}
                        </button>
                        <button onClick={e => {
                            e.stopPropagation();
                            this.changeTab(1)
                        }}
                                className={`tabsBtn__btn ${this.state.containerIndex ? "tabsBtn__btn-active" : ""}`}>{window.messagesTab}
                        </button>
                    </div>

                    {this.state.containerIndex ? <TerminalMessagesContainer/> : <TerminalStat/>}

                    <Loader showLoader={this.state.showLoader}/>

                </div>
            </div>
        )
    }
}

export default CommonContainer