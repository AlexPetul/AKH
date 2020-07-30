import React, {Component, useState} from 'react'
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import Input from "../../controls/Input";
import Textarea from "../../controls/Textarea"
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import MapModal from "./TerminalsList/MapModal";
import {AddressSuggestions} from 'react-dadata';
import {OWNER_TERMINALS} from "../../ContantUrls";
import Loader from "../../controls/Loader";


class OwnerAddTerminal extends Component {
    constructor() {
        super()
        this.state = {
            showModal: false,
            mapModal: false,
            showLoader: false,
            sendActivationStatus: false,
            latitude: null,
            longitude: null,
            terminalDescription: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста описание")],
                true),
        }
    }

    submit = () => {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        this.setState({showLoader: true}, () => {
            API.post('updateTerminal', {
                id: 0,
                description: this.state.terminalDescription.value,
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                address: document.getElementsByClassName('react-dadata__input')[0].value
            })
                .then(response => {
                    let newTerminalId = response.data.data.id;

                    if (this.state.sendActivationStatus) {
                        API.post('setTerminalStatus', {
                            sourceId: newTerminalId,
                            statusId: 302,
                            statusComment: ""
                        })
                            .then(response => {
                                this.setState({showModal: true})
                            })
                    } else {
                        this.setState({showModal: true})
                    }
                })
        });
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
        const {terminalDescription} = this.state;
        // const [value, setValue] = useState();

        return (
            <div className="content">
                <div className="container">
                    <div className="form">
                        <form>
                            <div className="caption">Добавить терминал</div>

                            <Textarea
                                label="Описание терминала"
                                name="terminalDescription"
                                value={terminalDescription.value}
                                onChange={this.handleChange}
                                className={terminalDescription.isValid ? 'textarea ' + this.inputStyle : `textarea ${this.inputStyle} error`}
                                isValid={terminalDescription.isValid}
                                validationMessageLength={terminalDescription.validationMessage.length}
                                validationMessageText={terminalDescription.validationMessage[0]}
                                cols="30"
                                rows="10"
                            />

                            <div className="form__input">
                                <div className="label-input">
                                    Адрес терминала
                                </div>
                                <AddressSuggestions
                                    className='input'
                                    token="24e416237ebb0c44592567b8f6cf67111453fd2a"/>
                            </div>

                            <div className="form__input">
                                <input type="submit" className="button button-deactive" onClick={e => {
                                    e.preventDefault();
                                    this.showMap()
                                }}
                                       style={{'background-color': '#97A0B6'}} value="Указать на карте"/>
                            </div>
                            <div className="form__input">
                                <div className="check check_nowrap">
                                    <label>
                                        <input type="checkbox" defaultChecked={false} onChange={e =>
                                            this.setState({sendActivationStatus: !this.state.sendActivationStatus})
                                        }/>
                                        <i></i>
                                        <span>
										Отправить запрос на активацию после добавления
									</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form__submit">
                                <input type="button" onClick={this.submit} className="button" value="Сохранить"/>
                                <div className="back">
                                    <a href="" onClick={event => {
                                        event.preventDefault();
                                        window.location = OWNER_TERMINALS;
                                    }}>Вернуться</a>
                                </div>
                            </div>

                        </form>
                    </div>

                    <Loader showLoader={this.state.showLoader}/>

                    <ModalWindow textTitle="Терминал успешно добавлен!" value="Ok"
                                 showModal={this.state.showModal}
                                 onClose={(e) => {
                                     window.location = OWNER_TERMINALS;
                                 }}
                    />

                </div>

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

        )
    }
}

export default OwnerAddTerminal