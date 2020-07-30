import React, {Component} from 'react'
import API from "../../services/api";
import Input from "../../controls/Input";
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import ModalWindow from "../ModalWindow";
import EmployeeChangePassword from "./EmployeeChangePassword";
import Loader from "../../controls/Loader";
import {OWNER_EMPLOYEES, ADMIN_EMPLOYEES} from "../../ContantUrls";


class EditEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteModal: false,
            successModal: false,
            showLoader: false,
            employeeRoles: [],
            userName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста имя")],
                true, this.props.editingEmployee.firstName),

            userLastName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста фамилию")],
                true, this.props.editingEmployee.lastName),

            userPatronymic: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста отчество")],
                true, this.props.editingEmployee.surName),

            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста email адрес"),
                new Rule(TypeOfRule.REGEX, "Введите пожалуйста email", /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ], true, this.props.editingEmployee.email),

            userPhone: new ValidationInput([new Rule(TypeOfRule.REGEX, "Введите пожалуйста телефон", /^([\s]*)$|^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/)],
                true, this.props.editingEmployee.phone),

            userIdentity: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста идентификатор")],
                true, this.props.editingEmployee.identity),

            userLogin: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста логин")],
                true, this.props.editingEmployee.login),

            userRole: {},
            rolesCount: this.props.editingEmployee.roleIds.length
        }
    }

    componentDidMount() {
        let rolesDict = {};
        let userRoles = this.props.editingEmployee.roleIds;
        for (let ind = 0; ind < userRoles.length; ind++) {
            rolesDict["select-role-" + ind] = userRoles[ind]
        }

        this.setState({showLoader: true}, () => {
            API.get('getDictionary', {
                params: {
                    name: 'terminalRoles'
                }
            })
                .then(response => {
                    this.setState({
                        employeeRoles: response.data.data,
                        userRole: rolesDict,
                        showLoader: false
                    })
                })
        });
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
                password: this.props.editingEmployee.password,
                login: this.state.userLogin.value,
                identity: this.state.userIdentity.value,
                email: this.state.userEmail.value,
                phone: this.state.userPhone.value,
                description: "",
                roleIds: Object.values(this.state.userRole),
                cellIds: []
            };
            this.setState({showLoader: true}, () => {
                API.post('updateTerminalUser', data)
                    .then(response => {
                        console.log(response);
                        this.setState({successModal: true, showLoader: false})
                    })
            });
        }
    };

    redirectToEmployeesList() {
        if ((localStorage.getItem('role_id') === "104") || (localStorage.getItem('context_id'))) {
            window.location = OWNER_EMPLOYEES;
        } else {
            window.location = ADMIN_EMPLOYEES;
        }
    }

    changeRole = event => {
        let dictRoles = this.state.userRole
        dictRoles[event.target.name] = parseInt(event.target.value, 10)
        this.setState({userRole: dictRoles})
    };

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
    };

    removeRole = event => {
        let roleToRemove = event.target.name;
        let chosenRoles = this.state.userRole;
        delete chosenRoles[roleToRemove];
        this.setState({userRole: chosenRoles});

        let selectControl = document.querySelectorAll("div[id='" + roleToRemove + "']");
        selectControl[0].outerHTML = "";
    };

    render() {
        const {userName, userLastName, userPatronymic, userEmail, userPhone, userIdentity, userLogin} = this.state;

        return (
            <div className="content content_myprofile">
                <div className="container">
                    <div className="form">
                        <form>
                            <div className="caption">Редактировать сотрудника</div>
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
                            <Input
                                label="Идентификатор"
                                name="userIdentity"
                                maxLength={50}
                                value={userIdentity.value}
                                onChange={this.handleChange}
                                className={userIdentity.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                isValid={userIdentity.isValid}
                                validationMessageLength={userIdentity.validationMessage.length}
                                validationMessageText={userIdentity.validationMessage[0]}
                            />
                            <Input
                                label="Логин"
                                name="userLogin"
                                maxLength={30}
                                value={userLogin.value}
                                onChange={this.handleChange}
                                className={userLogin.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                isValid={userLogin.isValid}
                                validationMessageLength={userLogin.validationMessage.length}
                                validationMessageText={userLogin.validationMessage[0]}
                            />
                            <form>
                                <div className="form__input">
                                    <div className="label-input">
                                        Выбрать роль
                                    </div>
                                    {Array.from(Array(this.state.rolesCount)).map((tr, tr_i) =>
                                        <div className="select select_role" id={"select-role-" + tr_i}>
                                            <select onChange={this.changeRole}
                                                    name={"select-role-" + tr_i}
                                                    value={this.state.userRole["select-role-" + tr_i]}>
                                                {this.state.employeeRoles.map((role, index) =>
                                                    <option value={role.id} key={index}>{role.name}</option>
                                                )}
                                            </select>
                                            {tr_i
                                                ?
                                                <a
                                                    name={"select-role-" + tr_i}
                                                    onClick={this.removeRole}
                                                    className="delete-role">Удалить роль
                                                </a>
                                                :
                                                null
                                            }
                                        </div>
                                    )}
                                </div>
                            </form>

                            <ModalWindow textTitle="Сотрудник успешно изменен." value="ОК"
                                         showModal={this.state.successModal}
                                         onClose={(e) => {
                                             this.redirectToEmployeesList()
                                         }}/>

                            <span className="add-role" onClick={e => {
                                e.preventDefault();
                                this.addRole()
                            }}>
                            Добавить еще роль
                            </span>
                            <div className="form__submit">
                                <input onClick={e => {
                                    e.preventDefault();
                                    this.submit()
                                }} type="button" className="button" value="Сохранить"/>
                                <div className="back">
                                    <a href="#" onClick={event => {
                                        event.preventDefault()
                                        this.props.handleChange(0)
                                    }}>Вернуться</a>
                                </div>
                            </div>
                        </form>
                    </div>

                    <Loader showLoader={this.state.showLoader}/>

                    <EmployeeChangePassword
                        employee={this.props.editingEmployee}
                        titleStyles="caption caption_change-password"
                    />

                </div>
            </div>
        )
    }
}

export default EditEmployee
