import React, {Component} from "react";
import Input from "../../controls/Input";
import Button from "../../controls/Button";
import {ValidationInput, ValidateState, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import API from "../../services/api";
import Link from "../../controls/Link";
import {LOGIN_PATH} from "../../ContantUrls";
import ModalWindow from "../ModalWindow";

class Restore extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super();
        this.state = {
            errorModal: false,
            portalToken: window.portal_token,
            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста email адрес"),
                new Rule(TypeOfRule.REGEX, "Введите пожалуйста email", /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ])
        };
    }

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };

    submit = (event) => {
        event.preventDefault();
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});

        if (validationResult.isValid) {
            let userMail = this.state.userEmail.value;
            API.get('getUsers', {
                headers: {'Token': this.state.portalToken}
            })
                .then(result => {
                    let users = result.data.data.list;
                    let currentUser = users.filter((x) => {
                        return x.email === userMail
                    });
                    console.log(currentUser);
                    if (currentUser.length !== 0) {
                        fetch('/send-reset-mail/', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({user: currentUser})
                        })
                            .then(result => {
                                console.log(result.json());
                                this.props.changeEmailSent(true);
                            })
                    } else {
                        this.setState({errorModal: true});
                    }
                });
        } else {
            this.props.changeEmailSent(false);
        }
    };

    updateData = value => {
        this.setState({userLogIn: value});
    };

    render() {
        const {userEmail} = this.state;
        return (
            <div className="form form_mini form_restore">
                <form>
                    <Input
                        label="Email"
                        name="userEmail"
                        maxLength={50}
                        value={userEmail.value}
                        onChange={this.handleChange}
                        className={userEmail.isValid ? this.inputStyle : `${this.inputStyle} error`}
                        isValid={userEmail.isValid}
                        validationMessageLength={userEmail.validationMessage.length}
                        validationMessageText={userEmail.validationMessage[0]}
                    />
                    <div className="form__submit">
                        <Button handleClick={this.submit} type="submit" value="Восстановить"/>
                        <Link className="back" path="/login/" text="Вернуться"/>
                    </div>
                </form>

                <ModalWindow
                    value="Ok"
                    textTitle="Пользователь с таким почтовым ящиком не найден."
                    showModal={this.state.errorModal}
                    onClose={(e) => {
                        this.setState({errorModal: false});
                    }}
                />

            </div>
        );
    }
}

export default Restore