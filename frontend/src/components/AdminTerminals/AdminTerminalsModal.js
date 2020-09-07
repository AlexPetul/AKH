import React, {Component} from 'react'
import API from "../../services/api";
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import DateInput from "../../controls/DateInput";
import {ADMIN_TERMINALS} from "../../ContantUrls";
import Input from "../../controls/Input";


class AdminTerminalsModal extends Component {
    inputStyle = "input input_weight";

    constructor(props) {
        super(props);
        this.state = {
            activationDate: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['field_date_error'][this.props.currentLanguage])],
                true, this.props.activationDate)
        }
    }

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };

    activateTerminal(prolongActivation) {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        if (validationResult.isValid) {
            let date = this.state.activationDate.value.split('.');
            let tzDate = new Date(date[2], date[1] - 1, date[0], 12, 0, 0, 0).toLocaleString("en-US", {timeZone: "Europe/Moscow"});
            let tzISODate = new Date(tzDate).toISOString();

            let api = prolongActivation ? 'changeTerminalTokenExpires' : 'activateTerminal';
            API.post(api, {
                id: this.props.terminal.id,
                expires: tzISODate
            })
                .then(response => {
                    console.log(response);
                    window.location = ADMIN_TERMINALS;
                })
        }
    }

    rejectActivation() {
        API.post('setTerminalStatus', {
            sourceId: this.props.terminal.id,
            statusId: 301,
            statusComment: ""
        })
            .then(response => {
                window.location = ADMIN_TERMINALS;
            })
    }

    render() {
        const {activationDate} = this.state;

        return (
            <React.Fragment>
                <div className="modal active">
                    <div className="modal__container">
                        <div className="modal__block">
                            <div className="modal__caption">
                                {this.props.terminal.statusId === 303
                                    ?
                                    <div className="modal__title">{window.pageContent['modal_prolong_header'][this.props.currentLanguage]}</div>
                                    :
                                    <div className="modal__title">{window.pageContent['modal_activate_header'][this.props.currentLanguage]}</div>
                                }
                            </div>

                            <div className="modal__info">
                                <div className="modal__name">{this.props.terminal.terminalGroupName}</div>
                                <div className="modal__label">
                                    {this.props.terminal.address}
                                </div>
                            </div>
                            <div className="form">

                                <DateInput
                                    label={window.pageContent['field_date'][this.props.currentLanguage]}
                                    name="activationDate"
                                    value={activationDate.value}
                                    onChange={this.handleChange}
                                    id="datepicker"
                                    className={activationDate.isValid ? this.inputStyle : `${this.inputStyle} error`}
                                    isValid={activationDate.isValid}
                                    validationMessageLength={activationDate.validationMessage.length}
                                    validationMessageText={activationDate.validationMessage[0]}
                                />

                                <div className="form__submit">
                                    <input type="submit" onClick={e => {
                                        e.preventDefault();
                                        this.props.terminal.statusId === 303
                                            ?
                                            this.activateTerminal(1)
                                            :
                                            this.activateTerminal(0)
                                    }} className="button"
                                           value={this.props.terminal.statusId === 303 ? window.pageContent['button_renew'][this.props.currentLanguage] : window.pageContent['button_activate'][this.props.currentLanguage]}/>
                                    <div className="cansel">
                                        <a href="" onClick={e => {
                                            e.preventDefault();
                                            this.props.rejectChanging()
                                        }}>{window.pageContent['button_cancel'][this.props.currentLanguage]}</a>
                                    </div>
                                </div>
                                <div className="form__submit">
                                    <a href="" onClick={e => {
                                        e.preventDefault();
                                        this.rejectActivation()
                                    }}>
                                        {this.props.terminal.statusId === 303 ? window.pageContent['deactivate'][this.props.currentLanguage] : window.pageContent['cancel_activation'][this.props.currentLanguage]}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminTerminalsModal
