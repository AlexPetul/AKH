import React, {Component} from 'react';
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../../helpers/ValidationHelper";
import Input from "../../../controls/Input";
import API from "../../../services/api";


class SendLogsModal extends Component {
    constructor(props) {
        super(props);
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_email'][currentLanguage]),
                new Rule(TypeOfRule.REGEX, window.pageContent['invalid_email'][currentLanguage], /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ], true)
        }
    }

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };

    componentDidMount() {
        API.get('getUsers')
            .then(response => {
                let defaultEmail = response.data.data.list[0].email;
                let emailField = document.querySelectorAll("input[name='userEmail']");
                emailField[0].value = defaultEmail;
                this.state.userEmail.value = defaultEmail;
            })
    }

    validateAndConfirm = () => {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        if (validationResult.isValid) {
            this.props.confirmRequest(this.state.userEmail.value);
        }
    };

    render() {
        let modal = (
            <div className="modal active">
                <div className="modal__container">
                    <div className="modal__block">
                        <div className="modal__caption">
                            <div className="modal__title">{this.props.textTitle}</div>
                        </div>

                        <Input
                            label="Email"
                            maxLength={50}
                            name="userEmail"
                            value={this.state.userEmail.value}
                            onChange={this.handleChange}
                            className={this.state.userEmail.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                            isValid={this.state.userEmail.isValid}
                            validationMessageLength={this.state.userEmail.validationMessage.length}
                            validationMessageText={this.state.userEmail.validationMessage[0]}
                        />

                        <div className="form__submit">
                            <input type="submit" onClick={e => {
                                e.preventDefault();
                                this.validateAndConfirm()
                            }} className="button" value={window.languageId === 1 ? "Отправить" : "Send"}/>
                            <div className="cansel">
                                <a href="" type="button" onClick={e => {
                                    e.preventDefault();
                                    this.props.rejectRequest()
                                }}>{window.languageId === 1 ? "Назад" : "Back"}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        if (!this.props.showModal) {
            modal = null;
        }
        return (
            <React.Fragment>
                {modal}
            </React.Fragment>

        )
    }
}

export default SendLogsModal;