import React, {Component} from 'react'
import Title from "../../controls/Title";
import Loader from "../../controls/Loader";
import TariffsList from "../../components/Tariffs/TariffsList";
import AddTariff from "../../components/Tariffs/AddTariff";
import Tab from "../../controls/Tab";
import AttachmentsList from "../../components/Tariffs/AttachmentsList";
import EditTariff from "../../components/Tariffs/EditTariff";
import AddTariffAttachment from "../../components/Tariffs/AddTariffAttachment";
import EditTariffAttachment from "../../components/Tariffs/EditTariffAttachment";
import API from "../../services/api";
import ModalWindow from "../../components/ModalWindow";


class TariffsContainer extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            showLoader: false,
            containerIndex: 0,
            errorModal: false,
            errorText: "",
            tariffAttachment: {},
            tariff: {}
        }
    }

    changeContainerIndex = (index, tariff = {}, tariffAttachment = {}) => {
        if (tariff) {
            this.setState({tariff: tariff});
        }
        if (tariffAttachment) {
            this.setState({tariffAttachment: tariffAttachment});
        }
        this.setState({containerIndex: index});
    };

    checkItemsExists = (index) => {
        API.get('getTariffs')
            .then(response => {
                if (response.data.data.list.length !== 0) {
                    API.get('getTerminals')
                        .then(response => {
                            if (response.data.data.list.length !== 0) {
                                API.get('getCellParameters')
                                    .then(response => {
                                        if (response.data.data.length !== 0) {
                                            this.setState({containerIndex: index});
                                        } else {
                                            this.setState({
                                                errorText: window.pageContent['cell_param_error'][this.state.currentLanguage],
                                                errorModal: true
                                            })
                                        }
                                    });
                            } else {
                                this.setState({
                                    errorText: window.pageContent['terminal_error'][this.state.currentLanguage],
                                    errorModal: true
                                })
                            }
                        });
                } else {
                    this.setState({
                        errorText: window.pageContent['tariff_error'][this.state.currentLanguage],
                        errorModal: true
                    })
                }
            });
    };

    render() {
        return (
            <div className="content">
                <div className="container">
                    {this.state.containerIndex === 2
                        ?
                        <AddTariff
                            currentLanguage={this.state.currentLanguage}
                            changeContainer={this.changeContainerIndex}
                        />
                        :
                        this.state.containerIndex === 3
                            ?
                            <EditTariff
                                currentLanguage={this.state.currentLanguage}
                                tariff={this.state.tariff}
                                changeContainer={this.changeContainerIndex}
                            />
                            :
                            this.state.containerIndex === 4
                                ?
                                <AddTariffAttachment
                                    currentLanguage={this.state.currentLanguage}
                                    changeContainer={this.changeContainerIndex}
                                />
                                :
                                this.state.containerIndex === 5
                                    ?
                                    <EditTariffAttachment
                                        currentLanguage={this.state.currentLanguage}
                                        changeContainer={this.changeContainerIndex}
                                        attachment={this.state.tariffAttachment}
                                    />
                                    :
                                    <React.Fragment>
                                        <div className="top">
                                            <div className="top__left">
                                                <Title titleText={window.pageContent['page_header'][this.state.currentLanguage]} titleStyles="caption"/>
                                                <Title titleText={window.pageContent['page_subheader'][this.state.currentLanguage]} titleStyles="description"/>
                                            </div>

                                            {this.state.containerIndex === 0
                                                ?
                                                <div className="top__right">
                                                    <a href="" onClick={e => {
                                                        e.preventDefault();
                                                        this.changeContainerIndex(2);
                                                    }} className="button">{window.pageContent['add_tariff_button'][this.state.currentLanguage]}</a>
                                                </div>
                                                :
                                                this.state.containerIndex === 1
                                                    ?
                                                    <div className="top__right">
                                                        <a href="" onClick={e => {
                                                            e.preventDefault();
                                                            this.checkItemsExists(4);
                                                        }} className="button">{window.pageContent['add_attachment_button'][this.state.currentLanguage]}</a>
                                                    </div>
                                                    :
                                                    null}
                                        </div>

                                        <div className="tabsBtn">
                                            <Tab
                                                handleClick={this.changeContainerIndex}
                                                index={0}
                                                containerIndex={this.state.containerIndex}
                                                tabText={window.pageContent['tariffs_tab'][this.state.currentLanguage]}
                                                className={`tabsBtn__btn ${this.state.containerIndex ? "" : "tabsBtn__btn-active"}`}
                                            />
                                            <Tab
                                                handleClick={this.changeContainerIndex}
                                                index={1}
                                                containerIndex={this.state.containerIndex}
                                                tabText={window.pageContent['attachments_tab'][this.state.currentLanguage]}
                                                className={`tabsBtn__btn ${this.state.containerIndex ? "tabsBtn__btn-active" : ""}`}
                                            />
                                        </div>

                                        {this.state.containerIndex === 0
                                            ?
                                            <TariffsList
                                                currentLanguage={this.state.currentLanguage}
                                                changeContainerIndex={this.changeContainerIndex}
                                            />
                                            :
                                            this.state.containerIndex === 1
                                                ?
                                                <AttachmentsList
                                                    currentLanguage={this.state.currentLanguage}
                                                    changeContainerIndex={this.changeContainerIndex}
                                                />
                                                :
                                                null
                                        }
                                    </React.Fragment>
                    }
                </div>
                <ModalWindow
                    textTitle={this.state.errorText}
                    value="Ok"
                    showModal={this.state.errorModal}
                    onClose={(e) => this.setState({errorModal: false})}
                />
                <Loader showLoader={this.state.showLoader}/>
            </div>
        )
    }
}

export default TariffsContainer;