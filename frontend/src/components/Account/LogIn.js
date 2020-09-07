import React, {Component} from "react";
import Input from "../../controls/Input";
import Button from "../../controls/Button";
import Link from "../../controls/Link";
import {ValidationInput, ValidateState, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import API from "../../services/api";
import Title from "../../controls/Title";
import ModalWindow from "../ModalWindow";
import Loader from "../../controls/Loader";
import {OWNER_CONFIGURATION, ADMIN_MAIN, OWNER_MAIN, FORGOT_PASSWORD_PATH} from "../../ContantUrls";


class LogIn extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            showLoader: false,
            showModal: false,
            currentLanguage: currentLanguage,
            currentUser: null,
            resetMailModal: false,
            errorModal: false,
            userInactiveModal: false,
            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_email'][currentLanguage]),
                new Rule(TypeOfRule.REGEX, window.pageContent['invalid_email'][currentLanguage], /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ]),
            userPassword: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_password'][currentLanguage])])
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
            this.setState({showLoader: true}, () => {

                API.post(window.apiLinks[0].short_name, {
                    login: this.state.userEmail.value,
                    password: this.state.userPassword.value
                })
                    .then(result => {
                        if (result.data.errorCode === 18) {
                            this.setState({errorModal: true})
                        } else {
                            if (result.data && result.data.data && result.data.data.token) {
                                localStorage.setItem('token', result.data.data.token);
                                localStorage.setItem('user_id', result.data.data.user.id);
                                localStorage.setItem('role_id', result.data.data.user.roleId);
                                localStorage.setItem('user_email', result.data.data.user.email);
                                localStorage.setItem('user_first_name', result.data.data.user.firstName);
                                localStorage.setItem('user_last_name', result.data.data.user.lastName);
                                localStorage.setItem('user_patronymic', result.data.data.user.surName);
                                localStorage.setItem('user_phone', result.data.data.user.phone);

                                let requestOptions = {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        "role_id": result.data.data.user.roleId,
                                        "token": result.data.data.token,
                                        "user_id": result.data.data.user.id
                                    }),
                                };

                                fetch("", requestOptions)
                                    .then(response => response.json())
                                    .then(responseJson => {
                                        let isUserActive = responseJson.user_activated
                                        if (isUserActive) {
                                            if (result.data.data.user.roleId === 104) {
                                                API.get(window.apiLinks[1].short_name)
                                                    .then(response => response.data)
                                                    .then(responseJson => {
                                                        const currentConfig = responseJson.data.list.map((data) => {
                                                            localStorage.setItem('group_id', data.id);
                                                            return data.configurationId
                                                        });

                                                        if (currentConfig[0] === 0) {
                                                            window.location = OWNER_CONFIGURATION;
                                                        } else if (currentConfig[0] === 1) {
                                                            window.location = OWNER_MAIN;
                                                        } else if (currentConfig[0] === 2) {
                                                            window.location = OWNER_MAIN;
                                                        } else if (currentConfig[0] === 3) {
                                                            window.location = OWNER_MAIN;
                                                        }
                                                    })
                                            } else {
                                                window.location = ADMIN_MAIN;
                                            }
                                        } else {
                                            this.setState({
                                                userInactiveModal: true,
                                                currentUser: result.data.data.user
                                            })
                                        }
                                    })
                            } else {
                                this.setState({showModal: true})
                            }
                        }
                    })
                    .catch(error => console.log('error', error))
                    .then(() => {
                        this.setState({showLoader: false})
                    })
            })
        }
    };

    sendAgainMail = () => {
        fetch('/save-inactive-user/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                newUserId: this.state.currentUser.id,
                email: this.state.currentUser.email
            })
        })
            .then(result => {
                console.log(result.json());
                this.setState({userInactiveModal: false, resetMailModal: true})
            })
    };

    updateData = value => {
        this.setState({userLogIn: value});
    };

    render() {
        const {userEmail, userPassword} = this.state;
        return (
            <React.Fragment>
                <div className="content">
                    <div className="container">
                        <div className="signin">
                            <Title titleText={window.pageContent['page_header'][this.state.currentLanguage]} titleStyles='title'/>
                            <div className="form form_mini">
                                <form onSubmit={this.submit}>
                                    <Input
                                        label={window.pageContent['email_field'][this.state.currentLanguage]}
                                        name="userEmail"
                                        maxLength={50}
                                        value={userEmail.value}
                                        onChange={this.handleChange}
                                        className={userEmail.isValid ? this.inputStyle : `${this.inputStyle} error`}
                                        isValid={userEmail.isValid}
                                        validationMessageLength={userEmail.validationMessage.length}
                                        validationMessageText={userEmail.validationMessage[0]}
                                    />
                                    <Input
                                        label={window.pageContent['password_field'][this.state.currentLanguage]}
                                        name="userPassword"
                                        maxLength={100}
                                        value={userPassword.value}
                                        onChange={this.handleChange}
                                        type="password"
                                        className={userPassword.isValid ? this.inputStyle : `${this.inputStyle} error`}
                                        isValid={userPassword.isValid}
                                        validationMessageLength={userPassword.validationMessage.length}
                                        validationMessageText={userPassword.validationMessage[0]}
                                    />
                                    <Link path={FORGOT_PASSWORD_PATH} className="form__link"
                                          text={window.pageContent['forgot_password'][this.state.currentLanguage]}/>
                                    <Button type="submit" handleClick={this.submit} value={window.pageContent['sign_in'][this.state.currentLanguage]}/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Loader showLoader={this.state.showLoader}/>

                <ModalWindow
                    value="Ok"
                    textTitle={window.pageContent['modal_user_blocked'][this.state.currentLanguage]}
                    showModal={this.state.errorModal}
                    onClose={(e) => this.setState({errorModal: false})}
                />

                <ModalWindow
                    value="Ok"
                    textTitle={window.pageContent['modal_user_not_exists'][this.state.currentLanguage]}
                    showModal={this.state.showModal} onClose={(e) => this.setState({showModal: false})}
                />

                <ModalWindow
                    value="Ok"
                    textTitle={window.pageContent['modal_confirm_email'][this.state.currentLanguage]}
                    showModal={this.state.userInactiveModal}
                    langId={this.state.currentLanguage}
                    sendAgainMail={this.sendAgainMail}
                    onClose={(e) => this.setState({userInactiveModal: false})}
                />

                <ModalWindow
                    value="Ok"
                    textTitle={window.pageContent['modal_mail_sent'][this.state.currentLanguage]}
                    showModal={this.state.resetMailModal}
                    onClose={(e) => this.setState({resetMailModal: false})}
                />

            </React.Fragment>
        );
    }
}

export default LogIn;