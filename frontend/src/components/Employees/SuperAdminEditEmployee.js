import React, {Component} from 'react'
import API from "../../services/api";
import Input from "../../controls/Input";
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import ModalWindow from "../ModalWindow";
import SuperAdminChangePassword from "./SuperAdminChangePassword";
import {ADMIN_EMPLOYEES, OWNER_EMPLOYEES} from "../../ContantUrls";
import Loader from "../../controls/Loader";


class SuperAdminEditEmployee extends Component {
    constructor(props) {
        super(props);
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            deleteModal: false,
            successModal: false,
            showLoader: false,
            isSuperAdmin: this.props.editingEmployee.roleId === 102,
            userName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_name_error'][currentLanguage])],
                true, this.props.editingEmployee.firstName),

            userLastName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_surname_error'][currentLanguage])],
                true, this.props.editingEmployee.lastName),

            userPatronymic: new ValidationInput([], true, this.props.editingEmployee.surName),

            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_email_error'][currentLanguage]),
                new Rule(TypeOfRule.REGEX, window.pageContent['invalid_email_error'][currentLanguage], /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ], true, this.props.editingEmployee.email),

            userPhone: new ValidationInput([new Rule(TypeOfRule.REGEX, window.pageContent['invalid_phone_error'][currentLanguage], /^([\s]*)$|^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/)],
                true, this.props.editingEmployee.phone),

        }
    }

    submit = () => {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        if (validationResult.isValid) {
            let data = {
                id: this.props.editingEmployee.id,
                lastName: this.state.userLastName.value,
                firstName: this.state.userName.value,
                surName: this.state.userPatronymic.value,
                email: this.state.userEmail.value,
                phone: this.state.userPhone.value,
                description: "",
                roleId: this.state.isSuperAdmin ? 102 : 103
            };

            this.setState({showLoader: true}, () => {
                API.post('updateUser', data)
                    .then(response => {
                        API.post('setUserRole', {
                            id: this.props.editingEmployee.id,
                            roleId: this.state.isSuperAdmin ? 102 : 103
                        })
                            .then(response => {
                                this.setState({successModal: true, showLoader: false})
                            })
                    })
            });
        }
    };

    redirectToEmployeesList() {
        if (localStorage.getItem('role_id') === "104") {
            window.location = OWNER_EMPLOYEES;
        } else {
            window.location = ADMIN_EMPLOYEES;
        }
    }

    changeRole = event => {
        let dictRoles = this.state.userRole
        dictRoles[event.target.name] = parseInt(event.target.value, 10)
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

    changeIsAdminRole() {
        this.setState({
            isSuperAdmin: !this.state.isSuperAdmin
        })
    }

    render() {
        const {userName, userLastName, userPatronymic, userEmail, userPhone} = this.state;

        return (
            <div className="content">
                <div className="container">
                    <div className="form">
                        <form>
                            <div
                                className="caption">{window.pageContent['edit_employee_header'][this.state.currentLanguage]}</div>
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
                                maxLength={50}
                                value={userEmail.value}
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

                            <div className="form__input">
                                <div className="check check_nowrap">
                                    <label>
                                        <input defaultChecked={this.state.isSuperAdmin} onChange={e => {
                                            this.changeIsAdminRole()
                                        }} type="checkbox"/>
                                        <i></i>
                                        <span>
										{window.pageContent['field_give_admin_role'][this.state.currentLanguage]}
									</span>
                                    </label>
                                </div>
                            </div>

                            <ModalWindow
                                textTitle={window.pageContent['modal_success_edit'][this.state.currentLanguage]}
                                value="ОК"
                                showModal={this.state.successModal}
                                onClose={(e) => {
                                    this.redirectToEmployeesList()
                                }}
                            />

                            <div className="form__submit">
                                <input onClick={e => {
                                    e.preventDefault();
                                    this.submit()
                                }} className="button" type="button"
                                       value={window.pageContent['save_button'][this.state.currentLanguage]}/>
                                <div className="back">
                                    <a href="" onClick={event => {
                                        event.preventDefault();
                                        this.props.handleChange(0)
                                    }}>{window.pageContent['back_button'][this.state.currentLanguage]}</a>
                                </div>
                            </div>
                        </form>
                    </div>

                    <Loader showLoader={this.state.showLoader}/>

                    <SuperAdminChangePassword
                        currentLanguage={this.state.currentLanguage}
                        id={this.props.editingEmployee.id}
                        redirectBack={this.redirectToEmployeesList}
                    />

                </div>
            </div>
        )
    }
}

export default SuperAdminEditEmployee
