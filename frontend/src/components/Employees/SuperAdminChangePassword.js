import React, {Component} from "react";
import Input from "../../controls/Input";
import {ValidationInput, ValidateState, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import Loader from "../../controls/Loader";


class SuperAdminChangePassword extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super();
        this.state = {
            showLoader: false,
            showModal: false,
            portalToken: window.portal_token,
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
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        if (validationResult.isValid) {
            this.setState({showLoader: true}, () => {
                API.post('setUserPassword',
                    {
                        id: this.props.id,
                        password: this.state.userPassword.value
                    },
                    {
                        headers: {'Token': this.state.portalToken}
                    })
                    .then(result => {
                        this.setState({showModal: true, showLoader: false})
                    })
            });
        }
    };

    updateData = value => {
        this.setState({userLogIn: value});
    };

    render() {
        const {userPassword, userPasswordRepeat} = this.state;
        return (
            <React.Fragment>
                <div className="form">
                    <div className="caption">
                        Сменить пароль
                    </div>
                    <form>
                        <Input
                            label="Введите новый пароль"
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
                            label="Повторите новый пароль"
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
                        <div className="form__submit">
                            <input type="submit" onClick={e => {
                                e.preventDefault()
                                this.submit()
                            }} className="button" value="Изменить"/>
                        </div>
                    </form>

                    <Loader showLoader={this.state.showLoader}/>

                    <ModalWindow textTitle="Пароль успешно изменен" value="ОК"
                                 showModal={this.state.showModal}
                                 onClose={(e) => {
                                     this.props.redirectBack()
                                 }}
                    />

                </div>
            </React.Fragment>
        );
    }
}

export default SuperAdminChangePassword;