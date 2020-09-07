import React, {Component} from "react";
import Input from "../../controls/Input";
import Button from "../../controls/Button";
import {ValidationInput, ValidateState, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import API from "../../services/api";
import Link from "../../controls/Link";
import ModalWindow from "../ModalWindow";

class Restore extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super();
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            errorModal: false,
            currentLanguage: currentLanguage,
            successModal: false,
            portalToken: window.portal_token,
            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_email_error'][currentLanguage]),
                new Rule(TypeOfRule.REGEX, window.pageContent['invalid_email_error'][currentLanguage], /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
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
                    console.log(result);
                    let users = result.data.data.list;
                    let currentUser = users.filter((x) => {
                        return x.email === userMail
                    });
                    if (currentUser.length !== 0) {
                        fetch('/send-reset-mail/', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({user: currentUser})
                        })
                            .then(result => {
                                console.log(result.json());
                                this.setState({successModal: true});
                            })
                    } else {
                        this.setState({errorModal: true});
                    }
                });
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
                        <Button handleClick={this.submit} type="submit"
                                value={window.pageContent['restore_button_text'][this.state.currentLanguage]}/>
                        <Link className="back" path="/login/"
                              text={window.pageContent['back_to_login'][this.state.currentLanguage]}/>
                    </div>
                </form>

                <ModalWindow
                    value="Ok"
                    textTitle={window.pageContent['modal_user_notfound'][this.state.currentLanguage]}
                    showModal={this.state.errorModal}
                    onClose={(e) => {
                        this.setState({errorModal: false});
                    }}
                />

                <ModalWindow
                    value="Ok"
                    textTitle={window.pageContent['modal_success'][this.state.currentLanguage]}
                    showModal={this.state.successModal}
                    onClose={(e) => {
                        this.setState({successModal: false});
                    }}
                />

            </div>
        );
    }
}

export default Restore