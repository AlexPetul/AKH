import React, {Component} from 'react'
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import Input from "../../controls/Input";
import Textarea from "../../controls/Textarea";
import API from "../../services/api";
import IntervalInput from "../../controls/IntervalInput";
import ModalWindow from "../ModalWindow";
import Loader from "../../controls/Loader";
import convertInterval from "../../services/convertInterval";


class AddTariff extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            languageId: 1,
            currentLanguage: currentLanguage,
            languagesIcons: window.languageIcons,
            languageList: [],
            successModal: false,
            errorText: "",
            errorModal: false,
            showLoader: false,
            name: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['name_error'][currentLanguage])],
                true),
            interval: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['interval_error'][currentLanguage]),
                new Rule(TypeOfRule.INTERVAL, window.pageContent['invalid_diapason_error'][currentLanguage])], true),
            price: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['price_error'][currentLanguage])],
                true),
            description: new ValidationInput([], true),
        }
    }

    componentDidMount() {
        this.setState({showLoader: true}, () => {
            API.get('getDictionary', {
                params: {
                    name: 'languages'
                }
            })
                .then(response => {
                    let languageList = response.data.data;
                    this.setState({
                        languageList: response.data.data,
                        showLoader: false
                    });
                    for (let index = 0; index < languageList.length; index++) {
                        if (this.state.languageId !== languageList[index].id) {
                            document.getElementById('lang__id__' + languageList[index].id).style.display = 'none';
                            document.getElementById('lang__input__' + languageList[index].id).style.display = 'none';
                        }
                    }
                });
        });
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
            let languages = document.getElementsByClassName('lang_input');
            let langFound = false;
            for (let index = 0; index < languages.length; index++) {
                if (languages[index].value !== "") {
                    langFound = true;
                    break;
                }
            }
            if (!langFound) {
                this.setState({
                    errorModal: true,
                    errorText: window.pageContent['language_error'][this.state.currentLanguage]
                })
            } else {
                let languagesList = [];
                for (let index = 0; index < languages.length; index++) {
                    languagesList.push({
                        languageId: Number(languages[index].getAttribute('lang_id')),
                        value: languages[index].value
                    })
                }
                this.setState({showLoader: true}, () => {
                    let clearInterval = convertInterval(Number(this.state.interval.value));
                    API.post('updateTariff', {
                        id: 0,
                        name: this.state.name.value,
                        names: languagesList,
                        description: this.state.description.value,
                        interval: Number(clearInterval),
                        price: Number(this.state.price.value)
                    })
                        .then(response => {
                            if (response.data.errorCode === 1) {
                                this.setState({
                                    errorText: window.pageContent['invalid_data'][this.state.currentLanguage],
                                    errorModal: true,
                                    showLoader: false
                                });
                            } else {
                                this.setState({showLoader: false, successModal: true});
                            }
                        })
                        .catch(error => {
                            this.setState({
                                errorText: window.pageContent['invalid_data'][this.state.currentLanguage],
                                errorModal: true,
                                showLoader: false
                            });
                        });
                });
            }
        }
    };

    changeLanguage(incr) {
        if ((this.state.languageId === this.state.languageList.length) && (incr === 1)) {
            document.getElementById('lang__id__' + this.state.languageId).style.display = 'none';
            document.getElementById('lang__input__' + this.state.languageId).style.display = 'none';
            this.setState({languageId: 1});
            document.getElementById('lang__id__' + 1).style.display = 'inline';
            document.getElementById('lang__input__' + 1).style.display = 'inline';
        } else if ((this.state.languageId === 1) && (incr === -1)) {
            document.getElementById('lang__id__' + this.state.languageId).style.display = 'none';
            document.getElementById('lang__input__' + this.state.languageId).style.display = 'none';
            this.setState({languageId: this.state.languageList.length});
            document.getElementById('lang__id__' + this.state.languageList.length).style.display = 'inline';
            document.getElementById('lang__input__' + this.state.languageList.length).style.display = 'inline';
        } else {
            document.getElementById('lang__id__' + this.state.languageId).style.display = 'none';
            document.getElementById('lang__input__' + this.state.languageId).style.display = 'none';
            let currentLangId = this.state.languageId + incr;
            this.setState({languageId: currentLangId});
            document.getElementById('lang__id__' + currentLangId).style.display = 'inline';
            document.getElementById('lang__input__' + currentLangId).style.display = 'inline';
        }
    }

    render() {
        const {name, interval, price, description} = this.state;

        return (
            <div className="form">
                <form>
                    <div className="caption">{window.pageContent['add_tariff_header'][this.state.currentLanguage]}</div>
                    <Input
                        label={window.pageContent['name_field'][this.state.currentLanguage]}
                        name="name"
                        maxLength={30}
                        value={name.value}
                        onChange={this.handleChange}
                        className={name.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                        isValid={name.isValid}
                        validationMessageLength={name.validationMessage.length}
                        validationMessageText={name.validationMessage[0]}
                    />
                    <div className="form__input">
                        <div className="wrap-label">
                            <div className="label-input">
                                {window.pageContent['text_field'][this.state.currentLanguage]}
                            </div>
                            <div className="lang">
                                <svg onClick={e => {
                                    e.preventDefault();
                                    this.changeLanguage(-1)
                                }} width="7" height="8" viewBox="0 0 7 8" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.500001 4.86603C-0.166666 4.48113 -0.166667 3.51887 0.5 3.13397L5 0.535898C5.66667 0.150998 6.5 0.632123 6.5 1.40192L6.5 6.59808C6.5 7.36788 5.66667 7.849 5 7.4641L0.500001 4.86603Z"
                                        fill="#98A0B5"/>
                                </svg>

                                {this.state.languageList.map((language, index) =>
                                    <p className="lang__text" id={'lang__id__' + language.id} key={index}>
                                        <img width={16} height={11} alt="dawmkda"
                                             src={'/media/original_images/' + this.state.languagesIcons[language.id]}/>
                                        {language.name}
                                    </p>
                                )}

                                <svg onClick={e => {
                                    e.preventDefault();
                                    this.changeLanguage(1)
                                }} width="7" height="8" viewBox="0 0 7 8" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.5 4.86603C7.16667 4.48113 7.16667 3.51887 6.5 3.13397L2 0.535898C1.33333 0.150998 0.5 0.632123 0.5 1.40192L0.5 6.59808C0.5 7.36788 1.33333 7.849 2 7.4641L6.5 4.86603Z"
                                        fill="#98A0B5"/>
                                </svg>
                            </div>
                        </div>

                        {this.state.languageList.map((language, index) =>
                            <div className="form__input" id={"lang__input__" + language.id} key={index}>
                                <input type="text"
                                       lang_id={language.id}
                                       className="input lang_input"
                                />
                            </div>
                        )}

                    </div>
                    <IntervalInput
                        label={window.pageContent['interval_field'][this.state.currentLanguage]}
                        name="interval"
                        maxLength={30}
                        intervalType={false}
                        value={interval.value}
                        onChange={this.handleChange}
                        className={interval.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                        isValid={interval.isValid}
                        validationMessageLength={interval.validationMessage.length}
                        validationMessageText={interval.validationMessage[0]}
                    />
                    <Input
                        label={window.pageContent['price_field'][this.state.currentLanguage]}
                        name="price"
                        maxLength={30}
                        value={price.value}
                        onChange={this.handleChange}
                        className={price.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                        isValid={price.isValid}
                        validationMessageLength={price.validationMessage.length}
                        validationMessageText={price.validationMessage[0]}
                    />
                    <Textarea
                        label={window.pageContent['description_field'][this.state.currentLanguage]}
                        name="description"
                        value={description.value}
                        onChange={this.handleChange}
                        className={description.isValid ? 'textarea ' + this.inputStyle : `textarea ${this.inputStyle} error`}
                        isValid={description.isValid}
                        validationMessageLength={description.validationMessage.length}
                        validationMessageText={description.validationMessage[0]}
                        cols="30"
                        rows="10"
                    />
                    <div className="form__submit">
                        <input type="button" className="button" onClick={e => {
                            e.preventDefault();
                            this.submit()
                        }} value={window.pageContent['save_button'][this.state.currentLanguage]}/>
                        <div className="back">
                            <a href="" onClick={event => {
                                event.preventDefault();
                                this.props.changeContainer(0);
                            }}>{window.pageContent['back_button'][this.state.currentLanguage]}</a>
                        </div>
                    </div>
                </form>
                <Loader showLoader={this.state.showLoader}/>
                <ModalWindow
                    textTitle={window.pageContent['success_add'][this.state.currentLanguage]}
                    value="Ok"
                    showModal={this.state.successModal}
                    onClose={(e) => {
                        this.setState({successModal: false});
                        this.props.changeContainer(0);
                    }}
                />
                <ModalWindow
                    textTitle={this.state.errorText}
                    value="Ok"
                    showModal={this.state.errorModal}
                    onClose={(e) => {
                        this.setState({errorModal: false});
                    }}
                />
            </div>
        )
    }
}

export default AddTariff;