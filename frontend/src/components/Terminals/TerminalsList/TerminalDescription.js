import React, {Component} from 'react'
import ModalWindow from "../../ModalWindow";
import ConfirmationModal from "./ConfirmationModal";
import API from "../../../services/api";
import Textarea from "../../../controls/Textarea";
import SendLogsModal from "./SendLogsModal";
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../../helpers/ValidationHelper";
import Input from "../../../controls/Input";
import MapModal from "./MapModal";
import {OWNER_TERMINALS} from "../../../ContantUrls";
import Loader from "../../../controls/Loader";


class TerminalDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activationModal: false,
            deleteRequest: false,
            sendLogsModal: false,
            showLoader: false,
            successSendLogsModal: false,
            sendRejectActivationModal: false,
            blockTerminalModal: false,
            editTerminalSuccess: false,
            latitude: this.props.terminal.latitude,
            longitude: this.props.terminal.longitude,
            mapModal: false,
            description: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста описание")],
                true, this.props.terminal.description),
            address: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста адрес")],
                true, this.props.terminal.address)
        }
    }

    sendActivationRequest() {
        this.setState({
            activationModal: true
        })
    }

    rejectSendingRequest = () => {
        this.setState({
            activationModal: false
        })
    };

    sendDeleteRequest() {
        this.setState({
            deleteRequest: true
        })
    }

    rejectDeleteRequest = () => {
        this.setState({
            deleteRequest: false
        })
    };

    confirmRequest = (newStatus) => {
        this.setState({showLoader: true}, () => {
            API.post('setTerminalStatus', {
                sourceId: this.props.terminal.id,
                statusId: Number(newStatus),
                statusComment: ""
            })
                .then(response => {
                    console.log(response)
                    this.setState({
                        activationModal: false,
                        deleteRequest: false,
                        showLoader: false
                    });
                    window.location = OWNER_TERMINALS;
                })
        });
    };

    sendRejectActivation() {
        this.setState({sendRejectActivationModal: true})
    }

    confirmSendRejectActivation = (_) => {
        this.setState({showLoader: true}, () => {
            API.post('setTerminalStatus', {
                sourceId: this.props.terminal.id,
                statusId: 301,
                statusComment: ""
            })
                .then(response => {
                    console.log(response);

                    this.setState({sendRejectActivationModal: false, showLoader: false});
                    window.location = OWNER_TERMINALS;
                })
        });
    };

    cancelSendRejectActivation = () => {
        this.setState({sendRejectActivationModal: false})
    };

    openSendLogsModal = () => {
        this.setState({sendLogsModal: true})
    };

    closeSendLogsModal = () => {
        this.setState({sendLogsModal: false})
    };

    sendTerminalLogs = (email) => {
        this.setState({showLoader: true}, () => {
            API.post('sendCommand', {
                terminalId: this.props.terminal.id,
                commandTypeId: 2,
                parameters: {"email": email}
            })
                .then(response => {
                    console.log(response);

                    this.setState({
                        sendLogsModal: false,
                        successSendLogsModal: true,
                        showLoader: false
                    })
                })
        });
    };

    openBlockTerminalModal() {
        this.setState({blockTerminalModal: true})
    }

    confirmBlockTerminal = (_) => {
        this.setState({showLoader: true}, () => {
            API.post('sendCommand', {
                terminalId: this.props.terminal.id,
                commandTypeId: 101,
                parameters: {}
            })
                .then(response => {
                    console.log(response);

                    this.setState({
                        blockTerminalModal: false,
                        showLoader: false
                    })
                })
        });
    };

    cancelBlockTerminal = (_) => {
        this.setState({blockTerminalModal: false})
    };

    submit = (e) => {
        e.preventDefault();

        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        if (validationResult.isValid) {
            this.setState({showLoader: true}, () => {
                API.post('updateTerminal', {
                    id: this.props.terminal.id,
                    description: this.state.description.value,
                    address: this.state.address.value,
                    latitude: this.state.latitude,
                    longitude: this.state.longitude
                })
                    .then(response => {
                        console.log(response);

                        this.setState({editTerminalSuccess: true, showLoader: false})
                    })
            });
        }
    };

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };

    showMap() {
        this.setState({mapModal: true})
    }

    closeMap = () => {
        this.setState({mapModal: false})
    };

    saveCoordinates = (coords) => {
        this.setState({
            longitude: coords[1],
            latitude: coords[0],
            mapModal: false
        })
    };

    render() {
        const description = this.state.description;
        const address = this.state.address;

        return (
            <React.Fragment>
                <div className="col">
                    <div className="form">
                        <form>

                            <Textarea
                                label="Описание терминала"
                                name="description"
                                value={description.value}
                                onChange={this.handleChange}
                                className={description.isValid ? 'textarea ' + this.inputStyle : `textarea ${this.inputStyle} error`}
                                isValid={description.isValid}
                                validationMessageLength={description.validationMessage.length}
                                validationMessageText={description.validationMessage[0]}
                                cols="30"
                                rows="10"
                            />

                            <div className="row row-flex-end" style={{'margin-left': '0px'}}>
                                <Input
                                    label="Адрес терминала"
                                    name="address"
                                    maxLength={100}
                                    value={address.value}
                                    onChange={this.handleChange}
                                    className={address.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                    isValid={address.isValid}
                                    id="terminal-address"
                                    validationMessageLength={address.validationMessage.length}
                                    validationMessageText={address.validationMessage[0]}
                                />
                                <div className="form__submit">
                                    <input type="submit" className="button-deactive" onClick={e => {
                                        e.preventDefault();
                                        this.showMap()
                                    }} value="Указать на карте"/>
                                </div>
                            </div>

                            <div className="form__submit">
                                <input onClick={this.submit} type="submit" className="button" value="Сохранить"/>
                            </div>

                            <div className="serviceBtn">

                                {this.props.terminal.statusId === 301
                                    ?
                                    <React.Fragment>
                                        <button className="serviceBtn__btn" onClick={e => {
                                            e.preventDefault();
                                            this.sendDeleteRequest()
                                        }}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M7.49967 2.5V3.33333H3.33301V5H4.16634V15.8333C4.16634 16.2754 4.34194 16.6993 4.6545 17.0118C4.96706 17.3244 5.39098 17.5 5.83301 17.5H14.1663C14.6084 17.5 15.0323 17.3244 15.3449 17.0118C15.6574 16.6993 15.833 16.2754 15.833 15.8333V5H16.6663V3.33333H12.4997V2.5H7.49967ZM7.49967 6.66667H9.16634V14.1667H7.49967V6.66667ZM10.833 6.66667H12.4997V14.1667H10.833V6.66667Z"
                                                    fill="#575D6C"/>
                                            </svg>
                                            Удалить
                                        </button>
                                    </React.Fragment>
                                    : null}

                                {this.props.terminal.statusId === 303
                                    ?
                                    <React.Fragment>
                                        <button className="serviceBtn__btn" onClick={e => {
                                            e.preventDefault();
                                            this.openBlockTerminalModal()
                                        }}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M7.49967 2.5V3.33333H3.33301V5H4.16634V15.8333C4.16634 16.2754 4.34194 16.6993 4.6545 17.0118C4.96706 17.3244 5.39098 17.5 5.83301 17.5H14.1663C14.6084 17.5 15.0323 17.3244 15.3449 17.0118C15.6574 16.6993 15.833 16.2754 15.833 15.8333V5H16.6663V3.33333H12.4997V2.5H7.49967ZM7.49967 6.66667H9.16634V14.1667H7.49967V6.66667ZM10.833 6.66667H12.4997V14.1667H10.833V6.66667Z"
                                                    fill="#575D6C"/>
                                            </svg>
                                            Заблокировать
                                        </button>
                                    </React.Fragment>
                                    : null}

                                {this.props.terminal.statusId === 301
                                    ?
                                    <React.Fragment>
                                        <button className="serviceBtn__btn" onClick={e => {
                                            e.preventDefault();
                                            this.sendActivationRequest()
                                        }}>
                                            <svg width="10" height="20" viewBox="0 0 10 20" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0 0V11H3V20L10 8H6L10 0H0Z" fill="#575D6C"/>
                                            </svg>
                                            Отправить запрос на активацию
                                        </button>
                                    </React.Fragment>
                                    : null}

                                {this.props.terminal.statusId === 302 || this.props.terminal.statusId === 303
                                    ?
                                    <React.Fragment>
                                        <button className="serviceBtn__btn" onClick={e => {
                                            e.preventDefault();
                                            this.sendRejectActivation()
                                        }}>
                                            <svg width="10" height="20" viewBox="0 0 10 20" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0 0V11H3V20L10 8H6L10 0H0Z" fill="#575D6C"/>
                                            </svg>
                                            Отменить активацию
                                        </button>
                                    </React.Fragment>
                                    : null}

                                <button className="serviceBtn__btn" onClick={e => {
                                    e.preventDefault();
                                    this.openSendLogsModal()
                                }}>
                                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M10.3146 7.50368C12.3775 7.50368 14.0279 9.17116 14.0279 11.2555C14.0279 11.9892 13.8216 12.6812 13.4585 13.2565L16 15.8411L14.853 17L12.2785 14.4404C11.7091 14.7989 11.0325 15.0074 10.3146 15.0074C8.25168 15.0074 6.60134 13.3399 6.60134 11.2555C6.60134 9.17116 8.25168 7.50368 10.3146 7.50368ZM10.3146 9.17116C9.76748 9.17116 9.24276 9.39076 8.85589 9.78166C8.46902 10.1725 8.25168 10.7027 8.25168 11.2555C8.25168 11.8083 8.46902 12.3385 8.85589 12.7294C9.24276 13.1203 9.76748 13.3399 10.3146 13.3399C10.8617 13.3399 11.3864 13.1203 11.7733 12.7294C12.1602 12.3385 12.3775 11.8083 12.3775 11.2555C12.3775 10.7027 12.1602 10.1725 11.7733 9.78166C11.3864 9.39076 10.8617 9.17116 10.3146 9.17116ZM1.65034 0H13.2027C14.1186 0 14.853 0.74203 14.853 1.66748V8.36243C14.4404 7.69544 13.8711 7.12016 13.2027 6.66994V1.66748H1.65034V13.3399H5.36359C5.61939 13.9652 5.99072 14.5238 6.44456 15.0074H1.65034C0.734399 15.0074 0 14.2653 0 13.3399V1.66748C0 0.74203 0.734399 0 1.65034 0ZM3.30067 3.33497H11.5523V5.00245H3.30067V3.33497ZM3.30067 6.66994H7.45126C6.79113 7.08681 6.22176 7.66209 5.77617 8.33742H3.30067V6.66994ZM3.30067 10.0049H5.09128C5.00052 10.4218 4.95101 10.8386 4.95101 11.2555V11.6724H3.30067V10.0049Z"
                                            fill="#575D6C"/>
                                    </svg>
                                    Скачать логи
                                </button>

                            </div>
                        </form>
                    </div>

                    <Loader showLoader={this.state.showLoader}/>

                    {this.state.activationModal
                        ?
                        <ConfirmationModal
                            textTitle="Отправить запрос на активацию?"
                            showModal={this.state.activationModal}
                            rejectRequest={this.rejectSendingRequest}
                            confirmRequest={this.confirmRequest}
                            newStatus="302"
                        />
                        :
                        null
                    }

                    {this.state.deleteRequest
                        ?
                        <ConfirmationModal
                            textTitle="Вы действительно хотите удалить терминал?"
                            showModal={this.state.deleteRequest}
                            rejectRequest={this.rejectDeleteRequest}
                            confirmRequest={this.confirmRequest}
                            newStatus="305"
                        />
                        :
                        null
                    }

                    {this.state.sendRejectActivationModal
                        ?
                        <ConfirmationModal
                            textTitle="Отменить запрос на активацию терминала?"
                            showModal={this.state.sendRejectActivationModal}
                            rejectRequest={this.cancelSendRejectActivation}
                            confirmRequest={this.confirmSendRejectActivation}
                            newStatus="305"
                        />
                        :
                        null
                    }

                    {this.state.blockTerminalModal
                        ?
                        <ConfirmationModal
                            textTitle="Вы уверены что хотите заблокировать терминал?"
                            showModal={this.state.blockTerminalModal}
                            rejectRequest={this.cancelBlockTerminal}
                            confirmRequest={this.confirmBlockTerminal}
                            newStatus="305"
                        />
                        :
                        null
                    }

                    {this.state.sendLogsModal
                        ?
                        <SendLogsModal
                            textTitle="Введите адрес почтового ящика"
                            showModal={this.state.sendLogsModal}
                            rejectRequest={this.closeSendLogsModal}
                            confirmRequest={this.sendTerminalLogs}
                        />
                        :
                        null
                    }

                    <ModalWindow
                        textTitle="Логи успешно отправлены на почту!"
                        value="Ok"
                        showModal={this.state.successSendLogsModal}
                        onClose={(e) => this.setState({successSendLogsModal: false})}
                    />

                    <ModalWindow
                        textTitle="Информация о терминале успешно изменена!"
                        value="Ok"
                        showModal={this.state.editTerminalSuccess}
                        onClose={(e) => this.setState({editTerminalSuccess: false})}
                    />

                    {this.state.mapModal
                        ?
                        <MapModal
                            lat={this.state.latitude}
                            long={this.state.longitude}
                            saveCoordinates={this.saveCoordinates}
                            closeMap={this.closeMap}
                        />
                        :
                        null
                    }

                </div>
            </React.Fragment>
        )
    }
}

export default TerminalDescription