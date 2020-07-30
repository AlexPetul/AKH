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
        this.state = {
            showLoader: false,
            showModal: false,
            currentUser: null,
            resetMailModal: false,
            errorModal: false,
            userInactiveModal: false,
            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста email адрес"),
                new Rule(TypeOfRule.REGEX, "Введите пожалуйста email", /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ]),
            userPassword: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста пароль")])
        };
    }

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };

    submit = () => {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state})
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
        fetch('/send-reset-mail/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user: [this.state.currentUser]})
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
                            <Title titleText={window.pageHeader} titleStyles='title'/>
                            <div className="form form_mini">
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
                                    <Input
                                        label="Пароль"
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
                                    <Link path={FORGOT_PASSWORD_PATH} className="form__link" text="Забыли пароль?"/>
                                    <Button handleClick={this.submit} value="Войти"/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Loader showLoader={this.state.showLoader}/>

                <ModalWindow
                    value="Ok"
                    textTitle="Пользователь заблокирован."
                    showModal={this.state.errorModal}
                    onClose={(e) => this.setState({errorModal: false})}
                />

                <ModalWindow value="Ok" textTitle="Пользователя с таким паролем и email не существует"
                             showModal={this.state.showModal} onClose={(e) => this.setState({showModal: false})}/>

                <ModalWindow
                    value="Ok"
                    textTitle="Пожалуйста, подтвердите свой почтовый ящик."
                    showModal={this.state.userInactiveModal}
                    sendAgainMail={this.sendAgainMail}
                    onClose={(e) => this.setState({userInactiveModal: false})}
                />

                <ModalWindow
                    value="Ok"
                    textTitle="Письмо для подтверждения отправлено на указанный email."
                    showModal={this.state.resetMailModal}
                    onClose={(e) => this.setState({resetMailModal: false})}
                />

            </React.Fragment>
        );
    }
}

export default LogIn;