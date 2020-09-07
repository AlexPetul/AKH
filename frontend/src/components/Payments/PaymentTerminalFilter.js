import React, {Component} from 'react'
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import Input from "../../controls/Input";


class PaymentTerminalFilter extends Component {
    inputStyle = "input";

    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            terminalID: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['invalid_terminal'][currentLanguage]),
                new Rule(TypeOfRule.REGEX, window.pageContent['invalid_terminal'][currentLanguage], /^\d+$/)])
        }
    }

    validateFields = () => {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        return validationResult.isValid ? this.state.terminalID.value : null;
    };

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };

    render() {
        return (
            <div className="form__input">
                <Input
                    label={window.pageContent['filter_terminal'][this.state.currentLanguage]}
                    name="terminalID"
                    maxLength={10}
                    value={this.state.terminalID.value}
                    onChange={this.handleChange}
                    className={this.state.terminalID.isValid ? this.inputStyle : `${this.inputStyle} error`}
                    isValid={this.state.terminalID.isValid}
                    validationMessageLength={this.state.terminalID.validationMessage.length}
                    validationMessageText={this.state.terminalID.validationMessage[0]}
                />
            </div>
        )
    }
}

export default PaymentTerminalFilter;