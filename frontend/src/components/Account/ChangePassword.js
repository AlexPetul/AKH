import React, {Component} from "react";
import Input from "../../controls/Input";
import Button from "../../controls/Button";
import {ValidationInput, ValidateState, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import Title from "../../controls/Title";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import Loader from "../../controls/Loader";

class ChangePassword extends Component {
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
        //validation
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        if (validationResult.isValid) {
            this.setState({showLoader: true}, () => {
                API.post('setUserPassword',
                    {
                        id: Number(window.userID) ? Number(window.userID) : Number(localStorage.getItem('user_id')),
                        password: this.state.userPassword.value
                    },
                    {
                        headers: {'Token': this.state.portalToken}
                    })
                    .then(result => {
                        console.log(result);
                        this.setState({showModal: true, showLoader: false})
                    })
            })
        }
    };

    updateData = value => {
        this.setState({userLogIn: value});
    };

    render() {
        const {userPassword, userPasswordRepeat} = this.state;
        return (
            <React.Fragment>
                <Title titleText={window.changePassHeader} titleStyles={this.props.titleStyles}/>
                <div className="form form_mini">
                    <form>
                        <Input
                            label={window.labelPassword}
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
                            label={window.labelPasswordRepeat}
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
                        <Button handleClick={this.submit} value={window.changePasswordButton}/>
                    </form>
                </div>
                <Loader showLoader={this.state.showLoader}/>
                <ModalWindow textTitle="Вы успешно изменили пароль" value="Ok" showModal={this.state.showModal}
                             onClose={(e) => this.setState({showModal: false})}/>
            </React.Fragment>
        );
    }
}

export default ChangePassword;