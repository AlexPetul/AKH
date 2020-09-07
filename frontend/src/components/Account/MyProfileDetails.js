import React, {Component} from 'react';
import Input from "../../controls/Input";
import Button from "../../controls/Button";
import Title from "../../controls/Title";
import {ValidationInput, ValidateState, ValidateRule, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import Loader from "../../controls/Loader";


class MyProfileDetails extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super();
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            showLoader: false,
            currentLanguage: currentLanguage,
            showModal: false,
            portalToken: window.portal_token,
            userName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_name_error'][currentLanguage])],
                true, localStorage.getItem('user_first_name')),

            userSurname: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_surname_error'][currentLanguage])],
                true, localStorage.getItem('user_last_name')),

            patronymic: new ValidationInput([], true, localStorage.getItem('user_patronymic')),

            userEmail: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_email_error'][currentLanguage]),
                new Rule(TypeOfRule.REGEX, window.pageContent['invalid_email_error'][currentLanguage], /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
            ], true, localStorage.getItem('user_email')),

            userPhone: new ValidationInput([new Rule(TypeOfRule.REGEX, window.pageContent['invalid_phone_error'][currentLanguage], /^([\s]*)$|^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/)],
                true, localStorage.getItem('user_phone'))
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
                        id: Number(localStorage.getItem('user_id')),
                        lastName: this.state.userSurname.value,
                        firstName: this.state.userName.value,
                        surName: this.state.patronymic.value,
                        email: this.state.userEmail.value,
                        phone: this.state.userPhone.value,
                        description: ""
                    },
                    {
                        headers: {'Token': this.state.portalToken}
                    })
                    .then(result => {
                        localStorage.setItem('user_email', this.state.userEmail.value,);
                        localStorage.setItem('user_first_name', this.state.userName.value,);
                        localStorage.setItem('user_last_name', this.state.userSurname.value,);
                        localStorage.setItem('user_patronymic', this.state.patronymic.value);
                        localStorage.setItem('user_phone', this.state.userPhone.value);
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
        const {userName, userSurname, patronymic, userEmail, userPhone} = this.state;
        return (
            <React.Fragment>
                <div className="form">
                    <form>
                        <Title titleText={window.pageContent['page_header'][this.state.currentLanguage]} titleStyles={this.props.titleStyles}/>
                        <Input
                            label={window.pageContent['label_name'][this.state.currentLanguage]}
                            name="userName"
                            maxLength={30}
                            value={userName.value}
                            onChange={this.handleChange}
                            className={userName.isValid ? this.inputStyle : `${this.inputStyle} error`}
                            isValid={userName.isValid}
                            validationMessageLength={userName.validationMessage.length}
                            validationMessageText={userName.validationMessage[0]}
                        />
                        <Input
                            label={window.pageContent['label_surname'][this.state.currentLanguage]}
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
                            label={window.pageContent['label_patronymic'][this.state.currentLanguage]}
                            name="patronymic"
                            maxLength={50}
                            value={patronymic.value}
                            onChange={this.handleChange}
                            className={patronymic.isValid ? this.inputStyle : `${this.inputStyle} error`}
                            isValid={patronymic.isValid}
                            validationMessageLength={patronymic.validationMessage.length}
                            validationMessageText={patronymic.validationMessage[0]}
                        />
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
                            label={window.pageContent['label_phone'][this.state.currentLanguage]}
                            name="userPhone"
                            maxLength={20}
                            type="tel"
                            value={userPhone.value}
                            onChange={this.handleChange}
                            className={userPhone.isValid ? this.inputStyle : `${this.inputStyle} error`}
                            isValid={userPhone.isValid}
                            validationMessageLength={userPhone.validationMessage.length}
                            validationMessageText={userPhone.validationMessage[0]}
                        />
                        <Button handleClick={this.submit} value={window.pageContent['save_profile_button'][this.state.currentLanguage]}/>
                    </form>
                </div>

                <Loader showLoader={this.state.showLoader}/>

                <ModalWindow
                    value="Ok"
                    textTitle={window.pageContent['modal_success'][this.state.currentLanguage]}
                    showModal={this.state.showModal}
                    onClose={(e) => this.setState({showModal: false})}
                />

            </React.Fragment>
        );
    }
}

export default MyProfileDetails;