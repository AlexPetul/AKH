import React, {Component} from "react";
import Input from "../../controls/Input";
import Button from "../../controls/Button";
import Title from "../../controls/Title";
import {ValidationInput, ValidateState, ValidateRule, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import Loader from "../../controls/Loader";
import {LOGIN_PATH} from "../../ContantUrls";


class FormRegistration extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super();
        this.state = {
            showLoader: false,
            showModal: false,
            successModal: false,
            portalToken: window.portal_token,
            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста email адрес"),
                new Rule(TypeOfRule.REGEX, "Введите пожалуйста email", /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ]),
            userName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста имя")]),
            userSurname: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста фамилию")]),
            userPassword: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста пароль"),
                new Rule(TypeOfRule.LENGTH5, "Пароль должен содержать более 5 символов"),
            ]),
            userPasswordRepeat: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Повторите пожалуйста пароль"),
                new Rule(TypeOfRule.REPEAT, "Пароли не совпадают", () => this.state.userPassword.value)
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

    submit = () => {
        //validation
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        if (validationResult.isValid) {
            this.setState({showLoader: true}, () => {
                API.post('updateUser',
                    {
                        id: 0,
                        lastName: this.state.userSurname.value,
                        firstName: this.state.userName.value,
                        email: this.state.userEmail.value,
                        password: this.state.userPassword.value,
                        roleId: 104
                    },
                    {
                        headers: {'Token': this.state.portalToken}
                    })
                    .then(result => {
                        if (result.data.errorCode === 5) {
                            // update token
                        } else if (result.data.errorCode === 6) {
                            this.setState({showModal: true, showLoader: false});
                            this.props.changeRegistrationStatus(false);
                        } else {
                            let newUserId = result.data.data.id;
                            fetch('/save-inactive-user/', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({
                                    newUserId: newUserId,
                                    email: this.state.userEmail.value
                                })
                            })
                                .then(response => {
                                    this.setState({successModal: true, showLoader: false})
                                })
                        }
                    })
            })
        }
    };

    updateData = value => {
        this.setState({userLogIn: value});
    };

    render() {
        const {userEmail, userName, userSurname, userPassword, userPasswordRepeat} = this.state;
        return (
            <React.Fragment>
                <Title titleText='Регистрация пользователя' titleStyles='title'/>
                <div className="form">
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
                            label="Имя"
                            maxLength={30}
                            name="userName"
                            value={userName.value}
                            onChange={this.handleChange}
                            className={userName.isValid ? this.inputStyle : `${this.inputStyle} error`}
                            isValid={userName.isValid}
                            validationMessageLength={userName.validationMessage.length}
                            validationMessageText={userName.validationMessage[0]}
                        />
                        <Input
                            label="Фамилия"
                            name="userSurname"
                            maxLength={30}
                            value={userSurname.value}
                            onChange={this.handleChange}
                            className={userSurname.isValid ? this.inputStyle : `${this.inputStyle} error`}
                            isValid={userSurname.isValid}
                            validationMessageLength={userSurname.validationMessage.length}
                            validationMessageText={userSurname.validationMessage[0]}
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
                        <Input
                            label="Повторить пароль"
                            name="userPasswordRepeat"
                            maxLength={100}
                            value={userPasswordRepeat.value}
                            onChange={this.handleChange}
                            type="password"
                            className={userPasswordRepeat.isValid ? this.inputStyle : `${this.inputStyle} error`}
                            isValid={userPasswordRepeat.isValid}
                            validationMessageLength={userPasswordRepeat.validationMessage.length}
                            validationMessageText={userPasswordRepeat.validationMessage[0]}
                        />
                        <Button handleClick={this.submit} value="Регистрация"/>
                    </form>
                </div>
                <Loader showLoader={this.state.showLoader}/>

                <ModalWindow value="Ok" textTitle="Письмо для подтверждения регистрации отправлено на указанный email"
                             showModal={this.state.successModal}
                             onClose={(e) => {
                                 this.setState({successModal: false});
                                 this.props.changeRegistrationStatus(true);
                                 window.location = LOGIN_PATH;
                             }}/>

                <ModalWindow value="Ok" textTitle="Пользователь с таким email уже зарегистрирован"
                             showModal={this.state.showModal}
                             onClose={(e) => this.setState({showModal: false})}/>
            </React.Fragment>
        );
    }
}


export default FormRegistration;