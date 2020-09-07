import React, {Component} from 'react'
import TerminalMessage from "../TerminalMessage";
import API from "../../../services/api";


class TerminalMessagesList extends Component {
    constructor() {
        super()
        this.state = {
            filterIds: [],
            messagesTypes: [],
            warningState: true,
            errorState: true,
            infoState: true,
            showLoader: false,
            messagesTableHeight: 0
        }
    }

    componentDidMount() {
        let wrapper = document.getElementsByClassName('collapse-messages')[0];

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
                    filterIds: filterIds,
                    messagesTypes: messagesTypes,
                    messagesTableHeight: wrapper.style.height
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
                console.log(arr)
                this.setState({filterIds: arr})
            }
        }
    };

    collapseMessages() {
        let wrapper = document.getElementsByClassName('collapse-messages')[0];
        let list = document.getElementsByClassName('listTerminals');
        if (wrapper.classList.contains('open')) {
            wrapper.classList.remove('open');
            wrapper.setAttribute('style', 'height:0px');
        } else {
            wrapper.classList.add('open');
            wrapper.setAttribute('style', `height:${this.state.messagesTableHeight}px`);
        }
    }

    render() {
        let messagesStates = [
            this.state.infoState,
            this.state.warningState,
            this.state.errorState
        ];

        return (
            <React.Fragment>
                <div className="wrap-accordeon">
                    <div className="accordeon">
                        <div className="accordeon__header">
                            <div className="caption">{window.pageContent['messages_text'][this.props.currentLanguage]}</div>
                            <span className="accordeon__btn" onClick={e => {
                                this.collapseMessages()
                            }}>{window.pageContent['hide_show_text'][this.props.currentLanguage]}</span>
                        </div>
                        <div className="accordeon__body collapse-messages open">
                            <div className="listTerminals">
                                <span className="listTerminals__text">{window.pageContent['display_text'][this.props.currentLanguage]}:</span>
                                {this.state.messagesTypes.map((mesType, index) =>
                                    <div key={index} className="form__input" style={{'marginTop': '0px'}}>
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
                            </div>

                            <div className="table-wrap">
                                <table>
                                    <tbody>
                                        {this.props.terminal.messages.map((message, ind) =>
                                            this.state.filterIds.includes(message.messageTypeId) ?
                                                <TerminalMessage
                                                    displayNumber={false}
                                                    key={ind}
                                                    message={message}
                                                    index={ind}
                                                    terminal={this.props.terminal}/>
                                                : null
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default TerminalMessagesList