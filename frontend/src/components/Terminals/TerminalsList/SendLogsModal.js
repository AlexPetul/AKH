import React, {Component} from 'react';
import {Rule, TypeOfRule, ValidationInput} from "../../../helpers/ValidationHelper";
import Input from "../../../controls/Input";
import API from "../../../services/api";


class SendLogsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста email адрес"),
                new Rule(TypeOfRule.REGEX, "Введите пожалуйста email", /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
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
            })

    }

    render() {
        const {userEmail} = this.state;

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
                            value={userEmail.value}
                            onChange={this.handleChange}
                            className={userEmail.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                            isValid={userEmail.isValid}
                            validationMessageLength={userEmail.validationMessage.length}
                            validationMessageText={userEmail.validationMessage[0]}
                        />

                        <div className="form__submit">
                            <input type="submit" onClick={e => {
                                e.preventDefault();
                                this.props.confirmRequest(this.state.userEmail.value)
                            }} className="button" value="Отправить"/>
                            <div className="cansel">
                                <a href="" type="button" onClick={e => {
                                    e.preventDefault();
                                    this.props.rejectRequest()
                                }}>Назад</a>
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