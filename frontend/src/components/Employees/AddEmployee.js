import React, {Component, useState} from 'react'
import Input from "../../controls/Input";
import {ValidationInput, ValidateState, ValidateRule, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import {OWNER_EMPLOYEES} from "../../ContantUrls";
import Loader from "../../controls/Loader";
import Title from "../../controls/Title";


class AddEmployee extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            deleteModal: false,
            currentLanguage: currentLanguage,
            showModal: false,
            successModal: false,
            showLoader: false,
            errorModal: false,
            errorText: "",
            employeesRoles: [],
            userName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_name_error'][currentLanguage])],
                true),

            userLastName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_surname_error'][currentLanguage])],
                true),

            userPatronymic: new ValidationInput([], true),

            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_email_error'][currentLanguage]),
                new Rule(TypeOfRule.REGEX, window.invalidEmailError, /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ], true),

            userPhone: new ValidationInput([new Rule(TypeOfRule.REGEX, window.pageContent['invalid_phone_error'][currentLanguage],
                /^([\s]*)$|^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/)], true),

            userIdentity: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_identity_error'][currentLanguage])],
                true),

            userLogin: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_login_error'][currentLanguage])],
                true),

            userPassword: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_password_error'][currentLanguage]),
                new Rule(TypeOfRule.LENGTH5, window.pageContent['invalid_password_len_error'][currentLanguage]),
            ]),

            userRole: {"select-role-0": 201},
            rolesCount: 1
        }
    }

    componentDidMount() {
        API.get('getDictionary', {
            params: {
                name: 'terminalRoles'
            }
        })
            .then(response => {
                this.setState({employeesRoles: response.data.data})
            })
    }

    submit = () => {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        if (validationResult.isValid) {
            let rawRoles = Object.values(this.state.userRole);
            let checkIsUnique = rawRoles.filter((v, i, a) => a.indexOf(v) === i);
            if (rawRoles.length !== checkIsUnique.length) {
                this.setState({
                    showModal: true
                })
            } else {
                let data = {
                    id: 0,
                    lastName: this.state.userLastName.value,
                    firstName: this.state.userName.value,
                    surName: this.state.userPatronymic.value,
                    login: this.state.userLogin.value,
                    password: this.state.userPassword.value,
                    identity: this.state.userIdentity.value,
                    email: this.state.userEmail.value,
                    phone: this.state.userPhone.value,
                    description: "",
                    roleIds: rawRoles,
                    cellIds: []
                };
                this.setState({showLoader: true}, () => {
                    API.post('updateTerminalUser', data)
                        .then(response => {
                            console.log(response);
                            let responseCode = response.data.errorCode;
                            if (responseCode === 16) {
                                this.setState({
                                    errorText: window.pageContent['modal_login_exists'][this.state.currentLanguage],
                                    errorModal: true,
                                    showLoader: false
                                })
                            } else if (responseCode === 17) {
                                this.setState({
                                    errorText: window.pageContent['modal_identity_exists'][this.state.currentLanguage],
                                    errorModal: true,
                                    showLoader: false
                                })
                            } else {
                                this.setState({
                                    successModal: true,
                                    showLoader: false
                                })
                            }
                        })
                });
            }
        }
    };

    changeRole = event => {
        let dictRoles = this.state.userRole
        dictRoles[event.target.name] = parseInt(event.target.value, 10);
        this.setState({userRole: dictRoles})
    }

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };

    addRole = () => {
        this.setState({
            rolesCount: this.state.rolesCount + 1
        })
    }

    removeRole = event => {
        let roleToRemove = event.target.name;
        let chosenRoles = this.state.userRole;
        delete chosenRoles[roleToRemove];
        this.setState({userRole: chosenRoles});

        let selectControl = document.querySelectorAll("div[id='" + roleToRemove + "']");
        selectControl[0].outerHTML = "";
    }


    render() {
        const {userName, userLastName, userPatronymic, userEmail, userPhone, userIdentity, userLogin, userPassword} = this.state;

        return (
            <div className="content">
                <div className="container">
                    <div className="form">
                        <form>
                            <Title titleText={window.pageContent['add_employee_header'][this.state.currentLanguage]} titleStyles='caption'/>
                            <Input
                                label={window.pageContent['field_name'][this.state.currentLanguage]}
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
                                label={window.pageContent['field_surname'][this.state.currentLanguage]}
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
                                label={window.pageContent['field_patronymic'][this.state.currentLanguage]}
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
                                value={userEmail.value}
                                maxLength={50}
                                onChange={this.handleChange}
                                className={userEmail.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                isValid={userEmail.isValid}
                                validationMessageLength={userEmail.validationMessage.length}
                                validationMessageText={userEmail.validationMessage[0]}
                            />
                            <Input
                                label={window.pageContent['field_phone'][this.state.currentLanguage]}
                                name="userPhone"
                                maxLength={20}
                                value={userPhone.value}
                                onChange={this.handleChange}
                                className={userPhone.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                isValid={userPhone.isValid}
                                validationMessageLength={userPhone.validationMessage.length}
                                validationMessageText={userPhone.validationMessage[0]}
                            />
                            <Input
                                label={window.pageContent['field_identity'][this.state.currentLanguage]}
                                name="userIdentity"
                                maxLength={30}
                                value={userIdentity.value}
                                onChange={this.handleChange}
                                className={userIdentity.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                isValid={userIdentity.isValid}
                                validationMessageLength={userIdentity.validationMessage.length}
                                validationMessageText={userIdentity.validationMessage[0]}
                            />
                            <Input
                                label={window.pageContent['field_login'][this.state.currentLanguage]}
                                name="userLogin"
                                maxLength={30}
                                value={userLogin.value}
                                onChange={this.handleChange}
                                className={userLogin.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                isValid={userLogin.isValid}
                                validationMessageLength={userLogin.validationMessage.length}
                                validationMessageText={userLogin.validationMessage[0]}
                            />
                            <Input
                                label={window.pageContent['field_password'][this.state.currentLanguage]}
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
                            <div className="form__input">
                                <div className="label-input">
                                    {window.pageContent['field_choose_role'][this.state.currentLanguage]}
                                </div>
                                {Array.from(Array(this.state.rolesCount)).map((tr, tr_i) =>
                                    <div key={tr_i} className="select select_role" id={"select-role-" + tr_i}>
                                        <select onChange={this.changeRole} name={"select-role-" + tr_i}
                                                value={this.state.userRole["select-role-" + tr_i]}>
                                            {this.state.employeesRoles.map((role, index) =>
                                                <option value={role.id} key={index}>{role.name}</option>
                                            )}
                                        </select>
                                        {tr_i
                                            ?
                                            <a
                                                name={"select-role-" + tr_i}
                                                onClick={this.removeRole}
                                                className="delete-role">{window.pageContent['delete_role'][this.state.currentLanguage]}
                                            </a>
                                            :
                                            null
                                        }
                                    </div>
                                )}
                            </div>
                            <span className="add-role" onClick={e => {
                                e.preventDefault();
                                this.addRole()
                            }}>
                                {window.pageContent['add_role'][this.state.currentLanguage]}
                            </span>
                            <div className="form__submit">
                                <input onClick={e => {
                                    e.preventDefault();
                                    this.submit()
                                }} type="button" className="button"
                                       value={window.languageId === 1 ? "Сохранить" : "Save"}/>
                                <div className="back">
                                    <a href="" onClick={event => {
                                        event.preventDefault();
                                        this.props.handleChange(0)
                                    }}>{window.languageId === 1 ? "Вернуться" : "Back"}</a>
                                </div>
                            </div>

                            <Loader showLoader={this.state.showLoader}/>

                            <ModalWindow
                                textTitle={this.state.errorText}
                                value="Ok"
                                showModal={this.state.errorModal}
                                onClose={(e) => this.setState({errorModal: false})}
                            />

                            <ModalWindow
                                textTitle={window.pageContent['modal_role_duplicate'][this.state.currentLanguage]}
                                value="Ok"
                                showModal={this.state.showModal}
                                onClose={(e) => this.setState({showModal: false})}
                            />

                            <ModalWindow
                                textTitle={window.pageContent['modal_success_add'][this.state.currentLanguage]}
                                value="Ok"
                                showModal={this.state.successModal}
                                onClose={(e) => {
                                    window.location = OWNER_EMPLOYEES;
                                }}
                            />

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddEmployee
