import React, {Component} from 'react'
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import Input from "../../controls/Input";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import Textarea from "../../controls/Textarea";
import {OWNER_DICTIONARIES} from "../../ContantUrls";
import Loader from "../../controls/Loader";
import Title from "../../controls/Title";


class AddDictionary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            languageId: 1,
            languagesIcons: window.languageIcons,
            languageList: [],
            showLoader: false,
            showModal: false,
            errorModal: false,
            textError: "",
            name: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['name_error'][this.props.currentLanguage])],
                true),
            height: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['height_error'][this.props.currentLanguage])],
                true),
            width: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['width_error'][this.props.currentLanguage])],
                true),
            depth: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['depth_error'][this.props.currentLanguage])],
                true),
            maxWeight: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['weight_error'][this.props.currentLanguage])],
                true),
            description: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['description_error'][this.props.currentLanguage])],
                true)
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
                    errorText: window.pageContent['language_error_modal'][this.props.currentLanguage]
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
                    API.post('updateCellParameter', {
                        id: 0,
                        width: Number(this.state.width.value),
                        height: Number(this.state.height.value),
                        depth: Number(this.state.depth.value),
                        maxWeight: Number(this.state.maxWeight.value),
                        name: this.state.name.value,
                        names: languagesList,
                        description: this.state.description.value
                    })
                        .then(response => {
                            this.setState({showModal: true, showLoader: false});
                        })
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
        const {name, height, width, depth, maxWeight, description} = this.state;

        return (
            <div className="content">
                <div className="container">
                    <div className="form">
                        <form>
                            <Title titleText={window.pageContent['add_header'][this.props.currentLanguage]} titleStyles='caption'/>
                            <Input
                                label={window.pageContent['field_name'][this.props.currentLanguage]}
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
                                        {window.pageContent['field_text'][this.props.currentLanguage]}
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

                            <Input
                                label={window.pageContent['field_height'][this.props.currentLanguage]}
                                name="height"
                                maxLength={10}
                                value={height.value}
                                onChange={this.handleChange}
                                className={height.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                isValid={height.isValid}
                                validationMessageLength={height.validationMessage.length}
                                validationMessageText={height.validationMessage[0]}
                            />

                            <Input
                                label={window.pageContent['field_width'][this.props.currentLanguage]}
                                name="width"
                                maxLength={10}
                                value={width.value}
                                onChange={this.handleChange}
                                className={width.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                isValid={width.isValid}
                                validationMessageLength={width.validationMessage.length}
                                validationMessageText={width.validationMessage[0]}
                            />

                            <Input
                                label={window.pageContent['field_depth'][this.props.currentLanguage]}
                                name="depth"
                                maxLength={10}
                                value={depth.value}
                                onChange={this.handleChange}
                                className={depth.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                isValid={depth.isValid}
                                validationMessageLength={depth.validationMessage.length}
                                validationMessageText={depth.validationMessage[0]}
                            />

                            <Input
                                label={window.pageContent['field_weight'][this.props.currentLanguage]}
                                name="maxWeight"
                                maxLength={10}
                                value={maxWeight.value}
                                onChange={this.handleChange}
                                className={maxWeight.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                isValid={maxWeight.isValid}
                                validationMessageLength={maxWeight.validationMessage.length}
                                validationMessageText={maxWeight.validationMessage[0]}
                            />

                            <Textarea
                                label={window.pageContent['field_description'][this.props.currentLanguage]}
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
                                }} value={window.pageContent['save_button'][this.props.currentLanguage]}/>
                                <div className="back">
                                    <a href="" onClick={event => {
                                        event.preventDefault();
                                        this.props.handler(0, null)
                                    }}>{window.pageContent['back_button'][this.props.currentLanguage]}</a>
                                </div>
                            </div>
                        </form>
                    </div>
                    <Loader showLoader={this.state.showLoader}/>
                </div>

                <ModalWindow
                    textTitle={this.state.errorText}
                    value="Ok"
                    showModal={this.state.errorModal}
                    onClose={(e) => {
                        this.setState({errorModal: false});
                    }}
                />

                <ModalWindow
                    textTitle={window.pageContent['position_add_modal'][this.props.currentLanguage]}
                    value="Ok"
                    showModal={this.state.showModal}
                    onClose={(e) => {
                        window.location = OWNER_DICTIONARIES;
                    }}
                />

            </div>
        )
    }
}

export default AddDictionary