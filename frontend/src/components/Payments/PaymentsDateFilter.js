import React, {Component} from 'react'
import DateMaskedInput from "../../controls/DateMaskedInput";
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import Input from "../../controls/Input";


class PaymentsDateFilter extends Component {
    constructor() {
        super();
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        let currDate = new Date();
        let currDay = currDate.getDate() < 10 ? `0${currDate.getDate()}` : currDate.getDate();
        let currMonth = currDate.getMonth() < 10 ? `0${currDate.getMonth() + 1}` : currDate.getMonth();

        this.state = {
            currentLanguage: currentLanguage,
            dateStart: new ValidationInput([new Rule(TypeOfRule.DATETIME, window.pageContent['invalid_date'][currentLanguage],
                /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-\d\d\d\d (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/)], true,
                `${currDay}-${currMonth}-${currDate.getFullYear()} 00:00:00`),
            dateEnd: new ValidationInput([new Rule(TypeOfRule.DATETIME, window.pageContent['invalid_date'][currentLanguage],
                /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-\d\d\d\d (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/)], true,
                `${currDay}-${currMonth}-${currDate.getFullYear()} 23:59:59`),
        }
    }

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };


    validateDates = () => {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        return validationResult.isValid ? [this.state.dateStart.value, this.state.dateEnd.value] : null;
    };

    render() {
        const {dateStart, dateEnd} = this.state;

        return (
            <div className="form__input">
                <DateMaskedInput
                    label={window.pageContent['filter_before'][this.state.currentLanguage]}
                    id="date-time-start"
                    value={dateStart.value}
                    name="dateStart"
                    onChange={this.handleChange}
                    isValid={dateStart.isValid}
                    validationMessageLength={dateStart.validationMessage.length}
                    validationMessageText={dateStart.validationMessage[0]}
                />
                <DateMaskedInput
                    label={window.pageContent['filter_after'][this.state.currentLanguage]}
                    id="date-time-end"
                    value={dateEnd.value}
                    name="dateEnd"
                    onChange={this.handleChange}
                    isValid={dateEnd.isValid}
                    validationMessageText={dateEnd.validationMessage[0]}
                />

                {!dateEnd.isValid || !dateStart.isValid
                    ?
                    <div className="label-error">{dateStart.validationMessage[0] || dateEnd.validationMessage[0]}</div>
                    :
                    null
                }

            </div>
        )
    }
}

export default PaymentsDateFilter;