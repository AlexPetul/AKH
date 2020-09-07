import React, {Component} from "react";
import Input from "../../controls/Input";
import Button from "../../controls/Button";
import {ValidationInput, ValidateState, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import Title from "../../controls/Title";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import Loader from "../../controls/Loader";
import {LOGIN_PATH} from "../../ContantUrls";


class ChangePassword extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super();
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            showLoader: false,
            showModal: false,
            currentLanguage: currentLanguage,
            portalToken: window.portal_token,
            userPassword: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_password_error'][currentLanguage]),
                new Rule(TypeOfRule.LENGTH5, window.pageContent['invalid_password_len_error'][currentLanguage]),
            ]),
            userPasswordRepeat: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_password_repeat_error'][currentLanguage]),
                new Rule(TypeOfRule.REPEAT, window.pageContent['invalid_password_mismatch_error'][currentLanguage], () => this.state.userPassword.value)
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
        return (
            <React.Fragment>
                <Title titleText={window.pageContent['change_pass_header'][this.state.currentLanguage]} titleStyles={this.props.titleStyles}/>
                <div className="form form_mini">
                    <form>
                        <Input
                            label={window.pageContent['label_password'][this.state.currentLanguage]}
                            name="userPassword"
                            maxLength={100}
                            value={this.state.userPassword.value}
                            onChange={this.handleChange}
                            type="password"
                            className={this.state.userPassword.isValid ? this.inputStyle : `${this.inputStyle} error`}
                            isValid={this.state.userPassword.isValid}
                            validationMessageLength={this.state.userPassword.validationMessage.length}
                            validationMessageText={this.state.userPassword.validationMessage[0]}
                        />
                        <Input
                            label={window.pageContent['label_repeat_password'][this.state.currentLanguage]}
                            name="userPasswordRepeat"
                            maxLength={100}
                            value={this.state.userPasswordRepeat.value}
                            onChange={this.handleChange}
                            type="password"
                            className={this.state.userPasswordRepeat.isValid ? this.inputStyle : `${this.inputStyle} error`}
                            isValid={this.state.userPasswordRepeat.isValid}
                            validationMessageLength={this.state.userPasswordRepeat.validationMessage.length}
                            validationMessageText={this.state.userPasswordRepeat.validationMessage[0]}
                        />
                        <Button handleClick={this.submit} value={window.pageContent['change_password_button'][this.state.currentLanguage]}/>
                    </form>
                </div>

                <Loader showLoader={this.state.showLoader}/>

                <ModalWindow
                    textTitle={window.pageContent['password_success_changed'][this.state.currentLanguage]}
                    value="Ok"
                    showModal={this.state.showModal}
                    onClose={(e) => {
                        this.setState({showModal: false});
                    }}
                />

            </React.Fragment>
        );
    }
}

export default ChangePassword;