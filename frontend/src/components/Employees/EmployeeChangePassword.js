import React, {Component} from 'react'
import API from "../../services/api";
import Input from "../../controls/Input";
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import ModalWindow from "../ModalWindow";
import Title from "../../controls/Title";
import Button from "../../controls/Button";
import Loader from "../../controls/Loader";
import {OWNER_EMPLOYEES} from "../../ContantUrls";


class EmployeeChangePassword extends Component {
    inputStyle = "input input_weight";

    constructor(props) {
        super(props);
        this.state = {
            successModal: false,
            userPassword: new ValidationInput([new Rule(TypeOfRule.REQUIRED,
                window.languageId === 1 ? "Введите пожалуйста пароль" : "Please input password"),
                new Rule(TypeOfRule.LENGTH5, window.languageId === 1 ? "Пароль должен содержать более 5 символов" : "Password must contain 6 or more symbols"),
            ]),
            userPasswordRepeat: new ValidationInput([new Rule(TypeOfRule.REQUIRED,
                window.languageId === 1 ? "Введите пожалуйста пароль" : "Please input password"),
                new Rule(TypeOfRule.LENGTH5, window.languageId === 1 ? "Пароль должен содержать более 5 символов" : "Password must contain 6 or more symbols"),
            ]),
        }
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
        this.setState({...validationResult.state});
        if (validationResult.isValid) {
            let data = {
                id: this.props.employee.id,
                lastName: this.props.employee.lastName,
                firstName: this.props.employee.firstName,
                surName: this.props.employee.surName,
                password: this.state.userPassword.value,
                login: this.props.employee.login,
                identity: this.props.employee.identity,
                email: this.props.employee.email,
                phone: this.props.employee.phone,
                description: "",
                roleIds: this.props.employee.roleIds,
                cellIds: []
            };

            API.post('updateTerminalUser', data)
                .then(response => {
                    console.log(response);
                    this.setState({successModal: true})
                })
        }
    };

    render() {
        const {userPassword, userPasswordRepeat} = this.state;

        return (
            <React.Fragment>
                <Title titleText={window.languageId === 1 ? "Сменить пароль" : "Change password"} titleStyles={this.props.titleStyles}/>
                <div className="form form_mini">
                    <form>
                        <Input
                            label={window.languageId === 1 ? "Новый пароль" : "New password"}
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
                            label={window.languageId === 1 ? "Повторите новый пароль" : "Repeat new password"}
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
                        <Button handleClick={this.submit} value={window.languageId === 1 ? "Сменить" : "Change"}/>
                    </form>
                </div>

                <ModalWindow
                    textTitle={window.languageId === 1 ? "Вы успешно изменили пароль!" : "Password successfully changed!"}
                    value="Ok"
                    showModal={this.state.successModal}
                    onClose={(e) => {
                        this.setState({successModal: false});
                        window.location = OWNER_EMPLOYEES;
                    }}/>

            </React.Fragment>
        )
    }
}

export default EmployeeChangePassword
