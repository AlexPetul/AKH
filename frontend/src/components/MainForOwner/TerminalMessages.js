import React, {Component} from 'react'
import API from "../../services/api";
import TerminalMessage from "../Terminals/TerminalMessage";
import Loader from "../../controls/Loader";


class TerminalMessages extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            terminals: [],
            currentLanguage: currentLanguage,
            filterIds: [],
            messagesTypes: [],
            warningState: true,
            errorState: true,
            infoState: true,
            showLoader: false
        }
    }

    componentDidMount() {
        this.setState({showLoader: true}, () => {
            API.get("getTerminals")
                .then(response => response.data)
                .then(responseData => {
                    let terminals = responseData.data.list;
                    API.get('getDictionary', {
                        params: {
                            name: 'messageTypes'
                        }
                    })
                        .then(response => {
                            let messagesTypes = response.data.data;
                            let filterIds = [];
                            for (let index = 0; index < messagesTypes.length; index++) {
                                filterIds.push(messagesTypes[index].id);
                            }
                            this.setState({
                                terminals: terminals,
                                messagesTypes: messagesTypes,
                                showLoader: false,
                                filterIds: filterIds
                            })
                        });
                })
        });
    }

    handleChange = (e, val) => {
        this.setState({
            warningState: !this.state.warningState,
            errorState: !this.state.errorState,
            infoState: !this.state.infoState,
        });

        let messageTypes = this.state.messagesTypes;
        for (let index = 0; index < messageTypes.length; index++) {
            if (messageTypes[index].name === val) {
                let arr = this.state.filterIds;
                if (arr.includes(parseInt(messageTypes[index].id, 10))) {
                    arr.splice(arr.indexOf(parseInt(messageTypes[index].id, 10)), 1);
                } else {
                    arr.push(parseInt(messageTypes[index].id, 10))
                }
                this.setState({filterIds: arr})
            }
        }
    };

    render() {
        let messagesStates = [
            this.state.infoState,
            this.state.warningState,
            this.state.errorState
        ];

        return (
            <div className="main main-4-col terminals">
                <div className="listTerminals">
                    <span className="listTerminals__text">{window.pageContent['display_text'][this.state.currentLanguage]}:</span>
                    {this.state.messagesTypes.map((mesType, index) =>
                        <div className="form__input" style={{'marginTop': '0px'}} key={index}>
                            <div className="check check_nowrap">
                                <label>
                                    <input value={mesType.name} onChange={e => {
                                        e.stopPropagation();
                                        this.handleChange(e, mesType.name)
                                    }} className="message_filter" type="checkbox"
                                           defaultChecked={messagesStates[index]}/>
                                    <i></i>
                                    <span>
                                        {mesType.name}
									</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="table-wrap">
                        <table>
                            <tbody>
                            {this.state.terminals.map((terminal, index) =>
                                terminal.messages.map((message, ind) =>
                                    this.state.filterIds.includes(message.messageTypeId) ?
                                        <TerminalMessage
                                            displayNumber={true}
                                            message={message}
                                            key={terminal.id + message.messageTypeId}
                                            terminal={terminal}
                                        />
                                        : null
                                )
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Loader showLoader={this.state.showLoader}/>

            </div>
        )
    }
}

export default TerminalMessages