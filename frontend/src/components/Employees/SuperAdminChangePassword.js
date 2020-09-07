import React, {Component} from "react";
import Input from "../../controls/Input";
import {ValidationInput, ValidateState, Rule, TypeOfRule} from "../../helpers/ValidationHelper";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import Loader from "../../controls/Loader";
import Title from "../../controls/Title";


class SuperAdminChangePassword extends Component {
    inputStyle = "input input_weight";

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showModal: false,
            portalToken: window.portal_token,
            userPassword: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_password_error'][this.props.currentLanguage]),
                new Rule(TypeOfRule.LENGTH5, window.pageContent['invalid_password_len_error'][this.props.currentLanguage]),
            ]),
            userPasswordRepeat: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_password_repeat_error'][this.props.currentLanguage]),
                new Rule(TypeOfRule.REPEAT, window.pageContent['invalid_password_repeat_error'][this.props.currentLanguage], () => this.state.userPassword.value)
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
                    <Title titleText={window.pageContent['change_password_header'][this.props.currentLanguage]} titleStyles='caption'/>
                    <form>
                        <Input
                            label={window.pageContent['field_password'][this.props.currentLanguage]}
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
                            label={window.pageContent['field_repeat_password'][this.props.currentLanguage]}
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
                                e.preventDefault();
                                this.submit()
                            }} className="button" value={window.pageContent['change_button'][this.props.currentLanguage]}
                            />
                        </div>
                    </form>

                    <Loader showLoader={this.state.showLoader}/>

                    <ModalWindow
                        textTitle={window.pageContent['modal_password_changed'][this.props.currentLanguage]}
                        value="ОК"
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