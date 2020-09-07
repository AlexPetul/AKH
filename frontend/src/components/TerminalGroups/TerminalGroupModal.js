import React, {Component} from 'react'
import Input from "../../controls/Input";
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";


class TerminalGroupModal extends Component {
    inputStyle = "input input_weight";

    constructor(props) {
        super(props);
        this.state = {
            groupName: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['modal_field_error'][this.props.currentLanguage])],
                true, this.props.group.name),

            groupDescription: new ValidationInput([], true, this.props.group.description),
        }
    }

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };

    sendConfirmEditing() {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state})
        if (validationResult.isValid) {
            this.props.confirmEditing(
                this.state.groupName.value,
                this.state.groupDescription.value
            )
        }
    }

    render() {
        const {groupName, groupDescription} = this.state

        return (
            <React.Fragment>
                <div className="modal active">
                    <div className="modal__container">
                        <div className="modal__block">
                            <div className="modal__caption">
                                <div className="modal__title">{window.pageContent['modal_header'][this.props.currentLanguage]}</div>
                                <div
                                    className="modal__sub-title">{this.props.owner.lastName} {this.props.owner.firstName} {this.props.owner.surName}</div>
                            </div>
                            <div className="form">
                                <Input
                                    label={window.pageContent['modal_field_name'][this.props.currentLanguage]}
                                    name="groupName"
                                    maxLength={30}
                                    value={this.state.groupName.value}
                                    onChange={this.handleChange}
                                    className={groupName.isValid ? this.inputStyle : `${this.inputStyle} error`}
                                    isValid={groupName.isValid}
                                    validationMessageLength={groupName.validationMessage.length}
                                    validationMessageText={groupName.validationMessage[0]}
                                />
                                <Input
                                    label={window.pageContent['modal_field_description'][this.props.currentLanguage]}
                                    maxLength={150}
                                    name="groupDescription"
                                    value={this.state.groupDescription.value}
                                    onChange={this.handleChange}
                                    className={groupDescription.isValid ? this.inputStyle : `${this.inputStyle} error`}
                                    isValid={groupDescription.isValid}
                                    validationMessageLength={groupDescription.validationMessage.length}
                                    validationMessageText={groupDescription.validationMessage[0]}
                                />
                                <div className="form__submit">
                                    <input type="submit" onClick={e => {
                                        e.preventDefault();
                                        this.sendConfirmEditing()
                                    }} className="button"
                                           value={window.pageContent['modal_button_save'][this.props.currentLanguage]}/>
                                    <div className="cansel">
                                        <a href="" onClick={e => {
                                            e.preventDefault();
                                            this.props.rejectEditing()
                                        }}>{window.pageContent['modal_button_cancel'][this.props.currentLanguage]}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default TerminalGroupModal
