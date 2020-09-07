import React, {Component} from 'react'
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import Input from "../../controls/Input";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import Textarea from "../../controls/Textarea";
import ConfirmationModal from "../Terminals/TerminalsList/ConfirmationModal";
import {OWNER_DICTIONARIES} from "../../ContantUrls";
import Loader from "../../controls/Loader";
import Title from "../../controls/Title";


class UpdatePosition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            languageId: 1,
            languagesIcons: window.languageIcons,
            languageList: [],
            showModal: false,
            showLoader: false,
            deleteConfirmation: false,
            name: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['name_error'][this.props.currentLanguage])],
                true, this.props.currentPosition.name),
            height: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['height_error'][this.props.currentLanguage])],
                true, this.props.currentPosition.height),
            width: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['width_error'][this.props.currentLanguage])],
                true, this.props.currentPosition.width),
            depth: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['depth_error'][this.props.currentLanguage])],
                true, this.props.currentPosition.depth),
            maxWeight: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['weight_error'][this.props.currentLanguage])],
                true, this.props.currentPosition.maxWeight),
            description: new ValidationInput([new Rule(TypeOfRule.REQUIRED, window.pageContent['description_error'][this.props.currentLanguage])],
                true, this.props.currentPosition.description),
            modalText: "",
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
                        id: this.props.currentPosition.id,
                        width: Number(this.state.width.value),
                        height: Number(this.state.height.value),
                        depth: Number(this.state.depth.value),
                        maxWeight: Number(this.state.maxWeight.value),
                        name: this.state.name.value,
                        names: languagesList,
                        description: this.state.description.value
                    })
                        .then(response => {
                            this.setState({
                                modalText: window.pageContent['position_edit_success'][this.props.currentLanguage],
                                showModal: true,
                                showLoader: false
                            })
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

    deletePosition = () => {
        this.setState({deleteConfirmation: true})
    };

    rejectDeleteRequest = () => {
        this.setState({deleteConfirmation: false})
    };

    confirmRequest = (_) => {
        API.post('deleteCellParameter', {
            id: this.props.currentPosition.id
        })
            .then(response => {
                this.setState({
                    modalText: window.pageContent['position_delete_success'][this.props.currentLanguage],
                    deleteConfirmation: false,
                    showModal: true
                })
            })
    };

    render() {
        const {name, height, width, depth, maxWeight, description} = this.state;

        return (
            <div className="content">
                <div className="container">
                    <div className="form">
                        <span className="map-data-card__close" onClick={e => {
                            event.preventDefault();
                            this.props.handler(0, null)
                        }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.23">
                                    <path
                                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                                        fill="black"/>
                                    </g>
                                </svg>
                            </span>
                        <form>
                            <Title titleText={window.pageContent['edit_header'][this.props.currentLanguage]} titleStyles='caption'/>
                            <Input
                                label={window.pageContent['field_name'][this.props.currentLanguage]}
                                name="name"
                                value={name.value}
                                maxLength={30}
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
                                        {this.props.currentPosition.names.map((name) =>
                                            name.languageId === language.id
                                                ?
                                                <input type="text"
                                                       lang_id={language.id}
                                                       className="input lang_input"
                                                       defaultValue={name.value}
                                                />
                                                :
                                                null
                                        )}
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
                                maxLength={150}
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
                                <button className="del" onClick={e => {
                                    e.preventDefault();
                                    this.deletePosition()
                                }}>
                                    <svg style={{'marginRight': '8px'}} width="14" height="15" viewBox="0 0 14 15"
                                         fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4.16667 0V0.833333H0V2.5H0.833333V13.3333C0.833333 13.7754 1.00893 14.1993 1.32149 14.5118C1.63405 14.8244 2.05797 15 2.5 15H10.8333C11.2754 15 11.6993 14.8244 12.0118 14.5118C12.3244 14.1993 12.5 13.7754 12.5 13.3333V2.5H13.3333V0.833333H9.16667V0H4.16667ZM4.16667 4.16667H5.83333V11.6667H4.16667V4.16667ZM7.5 4.16667H9.16667V11.6667H7.5V4.16667Z"
                                            fill="#F72D52"/>
                                    </svg>
                                    {window.pageContent['delete_button'][this.props.currentLanguage]}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <Loader showLoader={this.state.showLoader}/>

                {this.state.deleteConfirmation
                    ?
                    <ConfirmationModal
                        textTitle={window.pageContent['position_delete'][this.props.currentLanguage]}
                        showModal={this.state.deleteConfirmation}
                        rejectRequest={this.rejectDeleteRequest}
                        confirmRequest={this.confirmRequest}
                        newStatus="1"
                    />
                    :
                    null
                }

                <ModalWindow
                    textTitle={this.state.modalText}
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

export default UpdatePosition