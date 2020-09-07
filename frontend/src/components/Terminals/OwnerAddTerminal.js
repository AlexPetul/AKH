import React, {Component, useState} from 'react'
import {ValidationInput} from "../../helpers/ValidationHelper";
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
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            showModal: false,
            modalEmptyAddr: false,
            mapModal: false,
            showLoader: false,
            sendActivationStatus: false,
            latitude: null,
            longitude: null,
            terminalDescription: new ValidationInput([], true),
        }
    }

    submit = () => {
        let address = document.getElementsByClassName('react-dadata__input')[0].value;
        if (address.length !== 0) {
            this.setState({showLoader: true}, () => {
                API.post('updateTerminal', {
                    id: 0,
                    description: this.state.terminalDescription.value,
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    address: address
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
                                    this.setState({showLoader: false, showModal: true})
                                })
                        } else {
                            this.setState({showLoader: false, showModal: true})
                        }
                    })
            });
        } else {
            this.setState({modalEmptyAddr: true});
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
        const {terminalDescription} = this.state;

        return (
            <div className="content">
                <div className="container">
                    <div className="form">
                        <form>
                            <div className="caption">{window.pageContent['add_terminal_text'][this.state.currentLanguage]}</div>

                            <Textarea
                                label={window.pageContent['add_terminal_description'][this.state.currentLanguage]}
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
                                    {window.pageContent['add_terminal_address'][this.state.currentLanguage]}
                                </div>
                                <AddressSuggestions
                                    className='input'
                                    token="24e416237ebb0c44592567b8f6cf67111453fd2a"
                                />
                                <small className="coordinates__small">{window.pageContent['coordinates_text'][this.state.currentLanguage]}: {this.state.latitude ? '(' + this.state.latitude.toFixed(2) + ', ' + this.state.longitude.toFixed(2) + ')' : window.pageContent['coordinates_not_found'][this.state.currentLanguage]}</small>
                            </div>

                            <div className="form__input">
                                <input type="submit" className="button button-deactive" onClick={e => {
                                    e.preventDefault();
                                    this.showMap()
                                }}
                                       style={{'backgroundColor': '#97A0B6'}} value={window.pageContent['add_terminal_map_button'][this.state.currentLanguage]}/>
                            </div>
                            <div className="form__input">
                                <div className="check check_nowrap">
                                    <label>
                                        <input type="checkbox" defaultChecked={false} onChange={e =>
                                            this.setState({sendActivationStatus: !this.state.sendActivationStatus})
                                        }/>
                                        <i></i>
                                        <span>
										{window.pageContent['add_terminal_send_request'][this.state.currentLanguage]}
									</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form__submit">
                                <input type="button" onClick={this.submit} className="button"
                                       value={window.pageContent['add_terminal_save'][this.state.currentLanguage]}/>
                                <div className="back">
                                    <a href="" onClick={event => {
                                        event.preventDefault();
                                        window.location = OWNER_TERMINALS;
                                    }}>{window.pageContent['add_terminal_back'][this.state.currentLanguage]}</a>
                                </div>
                            </div>

                        </form>
                    </div>

                    <Loader showLoader={this.state.showLoader}/>

                    <ModalWindow
                        textTitle={window.pageContent['modal_add_success'][this.state.currentLanguage]}
                        value="Ok"
                        showModal={this.state.showModal}
                        onClose={(e) => {
                            window.location = OWNER_TERMINALS;
                        }}
                    />

                    <ModalWindow
                        textTitle={window.pageContent['modal_empty_addr'][this.state.currentLanguage]}
                        value="Ok"
                        showModal={this.state.modalEmptyAddr}
                        onClose={(e) => {
                            this.setState({modalEmptyAddr: false});
                        }}
                    />

                </div>

                {this.state.mapModal
                    ?
                    <MapModal
                        currentLanguage={this.state.currentLanguage}
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