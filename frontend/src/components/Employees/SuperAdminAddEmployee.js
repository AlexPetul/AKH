import React, {Component} from 'react'
import Input from "../../controls/Input";
import {ValidationInput, ValidateState, ValidateRule, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import {ADMIN_EMPLOYEES} from "../../ContantUrls";
import Loader from "../../controls/Loader";


class SuperAdminAddEmployee extends Component {
    constructor() {
        super()
        this.state = {
            deleteModal: false,
            successModal: false,
            errorModal: false,
            errorText: "",
            showLoader: false,
            userName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста имя")],
                true),

            userLastName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста фамилию")],
                true),

            userPatronymic: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста отчество")],
                true),

            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста email адрес"),
                new Rule(TypeOfRule.REGEX, "Введите пожалуйста email", /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ], true),

            userPhone: new ValidationInput([new Rule(TypeOfRule.REGEX, "Введите пожалуйста телефон", /^([\s]*)$|^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/)],
                true),

            userPassword: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста пароль"),
                new Rule(TypeOfRule.LENGTH5, "Пароль должен содержать более 5 символов"),
            ]),

            userRepeatPassword: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Повторите пароль"),
                new Rule(TypeOfRule.LENGTH5, "Пароль должен содержать более 5 символов"),
            ]),

            isAdminRole: false
        }
    }

    submit = () => {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        if (validationResult.isValid) {
            let data = {
                id: 0,
                lastName: this.state.userLastName.value,
                firstName: this.state.userName.value,
                surName: this.state.userPatronymic.value,
                email: this.state.userEmail.value,
                phone: this.state.userPhone.value,
                password: this.state.userPassword.value,
                roleId: this.state.isAdminRole ? 102 : 103
            };
            this.setState({showLoader: true}, () => {
                API.post('updateUser', data)
                    .then(response => {
                        let errorCode = response.data.errorCode;
                        if (errorCode === 6) {
                            this.setState({
                                errorText: "Пользователь с указанным email уже существует.",
                                errorModal: true,
                                showLoader: false
                            });
                        } else if (errorCode === 7) {
                            this.setState({
                                errorText: "Пользователь с указанным телефоном уже существует.",
                                errorModal: true,
                                showLoader: false
                            });
                        } else {
                            this.setState({
                                successModal: true,
                                showLoader: false
                            })
                        }
                    })
                    .catch(resp => {
                        console.log(resp);
                    })
            });
        }
    };

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };

    changeIsAdminRole() {
        this.setState({
            isAdminRole: !this.state.isAdminRole
        })
    }

    render() {
        const {userName, userLastName, userPatronymic, userEmail, userPhone, userPassword, userRepeatPassword} = this.state

        return (
            <React.Fragment>
                <div className="content">
                    <div className="container">
                        <div className="form">
                            <form>
                                <div className="caption">Добавить сотрудника</div>
                                <Input
                                    label="Имя"
                                    name="userName"
                                    maxLength={30}
                                    value={userName.value}
                                    onChange={this.handleChange}
                                    className={userName.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                    isValid={userName.isValid}
                                    validationMessageLength={userName.validationMessage.length}
                                    validationMessageText={userName.validationMessage[0]}
                                />
                                <Input
                                    label="Фамилия"
                                    name="userLastName"
                                    maxLength={30}
                                    value={userLastName.value}
                                    onChange={this.handleChange}
                                    className={userLastName.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                    isValid={userLastName.isValid}
                                    validationMessageLength={userLastName.validationMessage.length}
                                    validationMessageText={userLastName.validationMessage[0]}
                                />
                                <Input
                                    label="Отчество"
                                    name="userPatronymic"
                                    maxLength={30}
                                    value={userPatronymic.value}
                                    onChange={this.handleChange}
                                    className={userPatronymic.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                    isValid={userPatronymic.isValid}
                                    validationMessageLength={userPatronymic.validationMessage.length}
                                    validationMessageText={userPatronymic.validationMessage[0]}
                                />
                                <Input
                                    label="Email"
                                    name="userEmail"
                                    maxLength={50}
                                    value={userEmail.value}
                                    onChange={this.handleChange}
                                    className={userEmail.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                    isValid={userEmail.isValid}
                                    validationMessageLength={userEmail.validationMessage.length}
                                    validationMessageText={userEmail.validationMessage[0]}
                                />
                                <Input
                                    label="Телефон"
                                    name="userPhone"
                                    maxLength={20}
                                    value={userPhone.value}
                                    onChange={this.handleChange}
                                    className={userPhone.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                    isValid={userPhone.isValid}
                                    validationMessageLength={userPhone.validationMessage.length}
                                    validationMessageText={userPhone.validationMessage[0]}
                                />
                                <div className="form__input">
                                    <div className="check check_nowrap">
                                        <label>
                                            <input defaultChecked={false} onChange={e => {
                                                this.changeIsAdminRole()
                                            }} type="checkbox"/>
                                            <i></i>
                                            <span>
										Дать права на работу с данными сотрудников
									</span>
                                        </label>
                                    </div>
                                </div>
                                <Input
                                    label="Пароль"
                                    name="userPassword"
                                    maxLength={100}
                                    value={userPassword.value}
                                    onChange={this.handleChange}
                                    type="password"
                                    className={userPassword.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                    isValid={userPassword.isValid}
                                    validationMessageLength={userPassword.validationMessage.length}
                                    validationMessageText={userPassword.validationMessage[0]}
                                />
                                <Input
                                    label="Повторите пароль"
                                    name="userRepeatPassword"
                                    maxLength={100}
                                    value={userRepeatPassword.value}
                                    onChange={this.handleChange}
                                    type="password"
                                    className={userRepeatPassword.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                    isValid={userRepeatPassword.isValid}
                                    validationMessageLength={userRepeatPassword.validationMessage.length}
                                    validationMessageText={userRepeatPassword.validationMessage[0]}
                                />
                                <div className="form__submit">
                                    <input type="submit" onClick={e => {
                                        e.preventDefault();
                                        this.submit()
                                    }} className="button" value="Сохранить"/>
                                    <div className="back">
                                        <a href="#" onClick={event => {
                                            event.preventDefault();
                                            this.props.handleChange(0)
                                        }}>Вернуться</a>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <Loader showLoader={this.state.showLoader}/>

                        <ModalWindow
                            textTitle={this.state.errorText}
                            value="Ok"
                            showModal={this.state.errorModal}
                            onClose={(e) => {
                                e.preventDefault();
                                this.setState({errorModal: false});
                            }}
                        />

                        {this.state.successModal
                            ?
                            <ModalWindow textTitle="Сотрудник успешно добавлен!" value="Ok"
                                         showModal={this.state.successModal}
                                         onClose={(e) => {
                                             e.preventDefault();
                                             window.location = ADMIN_EMPLOYEES;
                                         }}
                            />
                            :
                            null
                        }

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default SuperAdminAddEmployee
