import React, {Component} from 'react'
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import API from "../../services/api";
import Loader from "../../controls/Loader";
import Textarea from "../../controls/Textarea";
import getISODate from "../../services/getISODate";
import Input from "../../controls/Input";
import DateMaskedInput from "../../controls/DateMaskedInput";
import ModalWindow from "../ModalWindow";


class AddTariffAttachment extends Component {
    inputStyle = "input input_weight";

    constructor(props) {
        super(props);
        this.state = {
            languageId: 0,
            successModal: false,
            errorModal: false,
            showLoader: false,
            terminals: [],
            tariffs: [],
            cellParams: [],
            position: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['position_error'][this.props.currentLanguage])],
                true),
            dateStart: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['date_error'][this.props.currentLanguage])],
                true),
            description: new ValidationInput([], true)
        }
    }

    handleChange = event => {
        const {name, value} = event.target;
        let input = this.state[name];
        this.setState({
            [name]: new ValidationInput(input.rules, input.isValid, value, input.validationMessage)
        });
    };

    componentDidMount() {
        this.setState({showLoader: true}, () => {
            API.get('getTerminals')
                .then(response => {
                    let terminals = response.data.data.list;
                    API.get('getTariffs')
                        .then(response => {
                            let tariffs = response.data.data.list;
                            API.get('getCellParameters')
                                .then(response => {
                                    let cellParams = response.data.data;
                                    this.setState({
                                        terminals: terminals,
                                        tariffs: tariffs,
                                        cellParams: cellParams,
                                        showLoader: false
                                    });
                                });
                        });
                });
        });
    }

    submit = () => {
        let validationResult = ValidateState(this.state);
        this.setState({...validationResult.state});
        this.setState({showLoader: true}, () => {
            if (validationResult.isValid) {
                let tariffSelect = document.getElementById('tariff__select');
                let tariffId = tariffSelect.options[tariffSelect.selectedIndex].value;
                let tariffName = tariffSelect.options[tariffSelect.selectedIndex].textContent;
                let terminalSelect = document.getElementById('terminal__select');
                let terminalId = terminalSelect.options[terminalSelect.selectedIndex].value;
                let cellParamSelect = document.getElementById('cellparam__select');
                let cellParamId = cellParamSelect.options[cellParamSelect.selectedIndex].value;
                let cellParamName = cellParamSelect.options[cellParamSelect.selectedIndex].textContent;
                API.post('updateTariffAttachment', {
                    id: 0,
                    tariffId: Number(tariffId),
                    terminalId: Number(terminalId),
                    cellParameterId: Number(cellParamId),
                    position: Number(this.state.position.value),
                    startDateTime: getISODate(this.state.dateStart.value),
                    description: this.state.description.value
                })
                    .then(response => {
                        this.setState({
                            showLoader: false,
                            successModal: true
                        })
                    });
            } else {
                this.setState({showLoader: false});
            }
        });
    };

    render() {
        return (
            <div className="form">
                <form>
                    <div className="caption">{window.pageContent['add_tariff_attachment_header'][this.props.currentLanguage]}</div>

                    <div className="form__input">
                        <div className="label-input">
                            {window.pageContent['field_tariff'][this.props.currentLanguage]}
                        </div>
                        <div className="select">
                            <select id="tariff__select">
                                {this.state.tariffs.map((tariff) =>
                                    <option key={tariff.id} value={tariff.id}>{tariff.name}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="form__input">
                        <div className="label-input">
                            {window.pageContent['field_terminal'][this.props.currentLanguage]}
                        </div>
                        <div className="select">
                            <select id="terminal__select">
                                {this.state.terminals.map((terminal, index) =>
                                    <option key={terminal.id} value={terminal.id}>{terminal.id}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="form__input">
                        <div className="label-input">
                            {window.pageContent['field_cell_parameter'][this.props.currentLanguage]}
                        </div>
                        <div className="select">
                            <select id="cellparam__select">
                                {this.state.cellParams.map((cellParam) =>
                                    <option key={cellParam.id} value={cellParam.id}>{cellParam.name}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <Input
                        label={window.pageContent['field_position'][this.props.currentLanguage]}
                        name="position"
                        maxLength={10}
                        value={this.state.position.value}
                        onChange={this.handleChange}
                        className={this.state.position.isValid ? this.inputStyle : `${this.inputStyle} error`}
                        isValid={this.state.position.isValid}
                        validationMessageLength={this.state.position.validationMessage.length}
                        validationMessageText={this.state.position.validationMessage[0]}
                    />

                    <DateMaskedInput
                        label={window.pageContent['field_date_start'][this.props.currentLanguage]}
                        name="dateStart"
                        value={this.state.dateStart.value}
                        onChange={this.handleChange}
                        id="date_fullwidth"
                        className={this.state.dateStart.isValid ? this.inputStyle : `${this.inputStyle} error`}
                        isValid={this.state.dateStart.isValid}
                        validationMessageLength={this.state.dateStart.validationMessage.length}
                        validationMessageText={this.state.dateStart.validationMessage[0]}
                    />

                    <Textarea
                        label={window.pageContent['field_description'][this.props.currentLanguage]}
                        name="description"
                        value={this.state.description.value}
                        onChange={this.handleChange}
                        className={this.state.description.isValid ? 'textarea ' + this.inputStyle : `textarea ${this.inputStyle} error`}
                        isValid={this.state.description.isValid}
                        validationMessageLength={this.state.description.validationMessage.length}
                        validationMessageText={this.state.description.validationMessage[0]}
                        cols="30"
                        rows="10"
                    />

                    <div className="form__submit">
                        <input type="button" className="button" onClick={e => {
                            e.preventDefault();
                            this.submit();
                        }} value={window.pageContent['save_button'][this.props.currentLanguage]}/>
                        <div className="back">
                            <a href="" onClick={event => {
                                event.preventDefault();
                                this.props.changeContainer(1);
                            }}>{window.pageContent['back_button'][this.props.currentLanguage]}</a>
                        </div>
                    </div>

                </form>
                <ModalWindow
                    value="Ok"
                    textTitle={window.pageContent['success_add_attachment'][this.props.currentLanguage]}
                    showModal={this.state.successModal}
                    onClose={(e) => {
                        this.setState({successModal: false});
                        this.props.changeContainer(1);
                    }}
                />
                <Loader showLoader={this.state.showLoader}/>
            </div>
        )
    }
}

export default AddTariffAttachment;