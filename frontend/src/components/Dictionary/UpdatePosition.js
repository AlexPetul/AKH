import React, {Component} from 'react'
import {Rule, TypeOfRule, ValidateState, ValidationInput} from "../../helpers/ValidationHelper";
import Input from "../../controls/Input";
import API from "../../services/api";
import ModalWindow from "../ModalWindow";
import Textarea from "../../controls/Textarea";
import ConfirmationModal from "../Terminals/TerminalsList/ConfirmationModal";
import {OWNER_DICTIONARIES} from "../../ContantUrls";
import Loader from "../../controls/Loader";


class UpdatePosition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            languageId: 0,
            showModal: false,
            showLoader: false,
            deleteConfirmation: false,
            name: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста наименование")],
                true, this.props.currentPosition.name),
            height: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста высоту")],
                true, this.props.currentPosition.height),
            width: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста ширину")],
                true, this.props.currentPosition.width),
            depth: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста глубину")],
                true, this.props.currentPosition.depth),
            maxWeight: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста максимальный вес")],
                true, this.props.currentPosition.maxWeight),
            nameRus: new ValidationInput([], true, this.props.currentPosition.names[0].value),
            nameEng: new ValidationInput([], true, this.props.currentPosition.names[1].value),
            description: new ValidationInput([new Rule(TypeOfRule.REQUIRED, "Введите пожалуйста описание")],
                true, this.props.currentPosition.description),
            modalText: "",
        }
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
                API.post('updateCellParameter', {
                    id: this.props.currentPosition.id,
                    width: Number(this.state.width.value),
                    height: Number(this.state.height.value),
                    depth: Number(this.state.depth.value),
                    maxWeight: Number(this.state.maxWeight.value),
                    name: this.state.name.value,
                    names: [
                        {
                            languageId: 1,
                            value: this.state.nameRus.value
                        },
                        {
                            languageId: 2,
                            value: this.state.nameEng.value
                        }
                    ],
                    description: this.state.description.value
                })
                    .then(response => {
                        this.setState({
                            modalText: "Типоразмер успешно изменен!",
                            showModal: true,
                            showLoader: false
                        })
                    })
            });
        }
    };

    changeLanguage() {
        if (this.state.languageId === 0) {
            this.setState({languageId: 1})
        } else {
            this.setState({languageId: 0})
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
                    modalText: "Типоразмер успешно удален!",
                    deleteConfirmation: false,
                    showModal: true
                })
            })
    };

    render() {
        const {name, height, width, depth, maxWeight, nameRus, nameEng, description} = this.state;

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
                            <div className="caption">Редактировать справочник</div>
                            <Input
                                label="Наименование"
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
                                        Текст
                                    </div>
                                    <div className="lang">
                                        <svg onClick={e => {
                                            e.preventDefault();
                                            this.changeLanguage()
                                        }} width="7" height="8" viewBox="0 0 7 8" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M0.500001 4.86603C-0.166666 4.48113 -0.166667 3.51887 0.5 3.13397L5 0.535898C5.66667 0.150998 6.5 0.632123 6.5 1.40192L6.5 6.59808C6.5 7.36788 5.66667 7.849 5 7.4641L0.500001 4.86603Z"
                                                fill="#98A0B5"/>
                                        </svg>

                                        {this.state.languageId === 0
                                            ?
                                            <p className="lang__text">
                                                <svg width="16" height="11" viewBox="0 0 16 11" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                     xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <rect width="16" height="11" fill="url(#pattern0)"/>
                                                    <defs>
                                                        <pattern id="pattern0" patternContentUnits="objectBoundingBox"
                                                                 width="1" height="1">
                                                            <use xlinkHref="#image0"
                                                                 transform="scale(0.0625 0.0909091)"/>
                                                        </pattern>
                                                        <image id="image0" width="16" height="11"
                                                               xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAABSElEQVQoFWWST0oDUQzGv6cDSu1CXdhS8ACC13Dlyiu48BDiFTyH7j2AS/fuXWgRu6sUS2Fe/siXTO0UB0K+5CW/lwmvLJfu2PoMZpmgtwiY+29iQMPSwSAbPFglgsQ63Bnvwn0HPO/bbPaTAHZkcx+UuX5DX5dSYqpyeVX95rpgPvcY3dTB0cwcSi2OyMkmZu7ouOD2/hvN86vh/KXg4xNRLBUQdVRx1Opoa2p6NraS/nScvxo7EEEUs0Cp1dG2HYRNHSSgBBOiBFjuQC2pcdDBqNm4dfN6MvrqcAIepiOcre6wWn7BROBVYLS2po94o7VWmCoOhhM8TR/RXOwN0MgbtL7zP+CEtC28XWvJHPO0fBwousDJ/iEac8StGI/guUFuM2ClxkZDQxSxIKU3QBUGR1kMJ07Bx0dY9wjjcB3/ncfaWLN5vL9kDHUg9lghxQAAAABJRU5ErkJggg=="/>
                                                    </defs>
                                                </svg>
                                                Русский
                                            </p>
                                            :
                                            <p className="lang__text">
                                                <svg width="16" height="11" viewBox="0 0 16 11" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                     xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <rect width="16" height="11" fill="url(#pattern0)"/>
                                                    <defs>
                                                        <pattern id="pattern1" patternContentUnits="objectBoundingBox"
                                                                 width="1" height="1">
                                                            <use xlinkHref="#image1"
                                                                 transform="scale(0.0625 0.0909091)"/>
                                                        </pattern>
                                                        <image id="image1" width="16" height="11"
                                                               xlinkHref="data:image/jpeg;base64,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"/>
                                                    </defs>
                                                </svg>
                                                English
                                            </p>
                                        }

                                        <svg onClick={e => {
                                            e.preventDefault();
                                            this.changeLanguage()
                                        }} width="7" height="8" viewBox="0 0 7 8" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M6.5 4.86603C7.16667 4.48113 7.16667 3.51887 6.5 3.13397L2 0.535898C1.33333 0.150998 0.5 0.632123 0.5 1.40192L0.5 6.59808C0.5 7.36788 1.33333 7.849 2 7.4641L6.5 4.86603Z"
                                                fill="#98A0B5"/>
                                        </svg>
                                    </div>
                                </div>

                                {this.state.languageId === 0
                                    ?
                                    <Input
                                        name="nameRus"
                                        maxLength={30}
                                        value={nameRus.value}
                                        onChange={this.handleChange}
                                        className={nameRus.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                        isValid={nameRus.isValid}
                                        validationMessageLength={nameRus.validationMessage.length}
                                        validationMessageText={nameRus.validationMessage[0]}
                                    />
                                    :
                                    <Input
                                        name="nameEng"
                                        value={nameEng.value}
                                        onChange={this.handleChange}
                                        className={nameEng.isValid ? 'input ' + this.inputStyle : `input ${this.inputStyle} error`}
                                        isValid={nameEng.isValid}
                                        validationMessageLength={nameEng.validationMessage.length}
                                        validationMessageText={nameEng.validationMessage[0]}
                                    />
                                }

                            </div>

                            <Input
                                label="Высота"
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
                                label="Ширина"
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
                                label="Глубина"
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
                                label="Максимальный вес"
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
                                label="Описание"
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
                                }} value="Сохранить"/>
                                <button className="del" onClick={e => {
                                    e.preventDefault();
                                    this.deletePosition()
                                }}>
                                    <svg style={{'margin-right': '8px'}} width="14" height="15" viewBox="0 0 14 15"
                                         fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4.16667 0V0.833333H0V2.5H0.833333V13.3333C0.833333 13.7754 1.00893 14.1993 1.32149 14.5118C1.63405 14.8244 2.05797 15 2.5 15H10.8333C11.2754 15 11.6993 14.8244 12.0118 14.5118C12.3244 14.1993 12.5 13.7754 12.5 13.3333V2.5H13.3333V0.833333H9.16667V0H4.16667ZM4.16667 4.16667H5.83333V11.6667H4.16667V4.16667ZM7.5 4.16667H9.16667V11.6667H7.5V4.16667Z"
                                            fill="#F72D52"/>
                                    </svg>
                                    Удалить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <Loader showLoader={this.state.showLoader}/>

                {this.state.deleteConfirmation
                    ?
                    <ConfirmationModal
                        textTitle="Вы действительно хотите удалить типоразмер?"
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