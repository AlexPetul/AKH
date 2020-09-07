import React, {Component, useState} from 'react'
import API from "../../services/api";
import TerminalMessagesContainer from "../../components/MainForOwner/TerminalMessages";
import TerminalStat from "../../components/MainForOwner/TerminalStat";
import Loader from "../../controls/Loader";
import {OWNER_CONFIGURATION, OWNER_MAIN} from "../../ContantUrls";
import Tab from "../../controls/Tab";


class CommonContainer extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            showLoader: false,
            currentLanguage: currentLanguage,
            terminalsCount: 0,
            configuration: "",
            configurations: [],
            groupId: 0,
            currencies: [],
            containerIndex: 0
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
                    let currentConfig = responseJson.data.list[0].configurationId;
                    let currencyCode = responseJson.data.list[0].currencyCode;
                    let groupId = responseJson.data.list[0].id;
                    API.get('getDictionary', {
                        params: {
                            name: 'configurations'
                        }
                    })
                        .then(response => {
                            let configurations = response.data.data;
                            API.get('getDictionary', {
                                params: {
                                    name: 'currencies'
                                }
                            })
                                .then(response => {
                                    let currencies = response.data.data;
                                    this.setState({
                                        configurations: configurations,
                                        configuration: currentConfig,
                                        currencyCode: currencyCode,
                                        currencies: currencies,
                                        groupId: groupId,
                                        terminalsCount: responseJson.data.list[0].terminalsCount,
                                        showLoader: false
                                    });
                                });
                        });
                })
        });
    }

    changeTab = (containerIndex) => {
        this.setState({
            containerIndex: containerIndex
        })
    };

    currencyChange = event => {
        let currencyCode = event.target.options[event.target.selectedIndex].id;
        API.post('setCurrency', {
            id: this.state.groupId,
            currencyCode: Number(currencyCode)
        })
            .then(response => {
                window.location = OWNER_MAIN;
            });
    };

    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="caption" style={{'marginBottom': '10px'}}>
                        {window.pageContent['page_header'][this.state.currentLanguage]}: <span
                        className="caption__span">
                        {this.state.configurations.map((config) =>
                            config.id === this.state.configuration ? config.name : null
                        )}
                    </span>
                        {this.state.terminalsCount === 0 ?
                            <button onClick={e => {
                                e.stopPropagation();
                                window.location = OWNER_CONFIGURATION;
                            }}
                                    className="caption__btn">{window.pageContent['change_config_button'][this.state.currentLanguage]}
                            </button>
                            : null
                        }
                    </div>
                    {this.state.configuration !== 2
                        ?
                        <div className="caption">
                            {window.pageContent['currency_header'][this.state.currentLanguage]}:
                            {this.state.terminalsCount > 0
                                ?
                                <span className="caption__span">
                                    {this.state.currencies.map((currency, index) =>
                                        currency.id === this.state.currencyCode ? currency.name : null
                                    )}
                                </span>
                                :
                                <div className="select currency__select">
                                    <select onChange={this.currencyChange}>
                                        {this.state.currencies.map((currency, index) =>
                                            <option value={currency.id} id={currency.id}
                                                    selected={currency.id === this.state.currencyCode}
                                                    key={currency.id}>{currency.name}</option>
                                        )}
                                    </select>
                                </div>
                            }
                        </div> : null}
                    <div className="tabsBtn">
                        <Tab
                            handleClick={this.changeTab}
                            index={0}
                            containerIndex={this.state.containerIndex}
                            tabText={window.pageContent['stat_tab'][this.state.currentLanguage]}
                            className={`tabsBtn__btn ${this.state.containerIndex ? "" : "tabsBtn__btn-active"}`}
                        />
                        <Tab
                            handleClick={this.changeTab}
                            index={1}
                            containerIndex={this.state.containerIndex}
                            tabText={window.pageContent['messages_tab'][this.state.currentLanguage]}
                            className={`tabsBtn__btn ${this.state.containerIndex ? "tabsBtn__btn-active" : ""}`}
                        />
                    </div>

                    {this.state.containerIndex ? <TerminalMessagesContainer/> : <TerminalStat/>}

                    <Loader showLoader={this.state.showLoader}/>

                </div>
            </div>
        )
    }
}

export default CommonContainer