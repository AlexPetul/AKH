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
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            showLoader: false,
            currentLanguage: currentLanguage,
            showModal: false,
            successModal: false,
            portalToken: window.portal_token,
            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_email_error'][currentLanguage]),
                new Rule(TypeOfRule.REGEX, window.pageContent['invalid_email_error'][currentLanguage], /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ]),
            userName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_name_error'][currentLanguage])]),
            userSurname: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_surname_error'][currentLanguage])]),
            userPassword: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_password_error'][currentLanguage]),
                new Rule(TypeOfRule.LENGTH5, window.pageContent['invalid_password_len_error'][currentLanguage]),
            ]),
            userPasswordRepeat: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_reset_password_error'][currentLanguage]),
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
                <Title titleText={window.pageContent['page_header'][this.state.currentLanguage]} titleStyles='title'/>
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
                            label={window.pageContent['field_name'][this.state.currentLanguage]}
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
                            label={window.pageContent['field_surname'][this.state.currentLanguage]}
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
                            label={window.pageContent['field_password'][this.state.currentLanguage]}
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
                            label={window.pageContent['field_repeat_password'][this.state.currentLanguage]}
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
                        <Button handleClick={this.submit}
                                value={window.pageContent['sign_up_button'][this.state.currentLanguage]}/>
                    </form>
                </div>

                <Loader showLoader={this.state.showLoader}/>

                <ModalWindow
                    value="Ok"
                    textTitle={window.pageContent['modal_email_sent'][this.state.currentLanguage]}
                    showModal={this.state.successModal}
                    onClose={(e) => {
                        this.setState({successModal: false});
                        window.location = LOGIN_PATH;
                    }}
                />

                <ModalWindow
                    value="Ok"
                    textTitle={window.pageContent['modal_user_exists'][this.state.currentLanguage]}
                    showModal={this.state.showModal}
                    onClose={(e) => this.setState({showModal: false})}
                />

            </React.Fragment>
        );
    }
}


export default FormRegistration;