import React, {Component} from 'react'
import Title from "../../controls/Title";
import PaymentsDateFilter from "../../components/Payments/PaymentsDateFilter";
import PaymentTerminalFilter from "../../components/Payments/PaymentTerminalFilter";
import getISODate from "../../services/getISODate";
import Loader from "../../controls/Loader";
import SendLogsModal from "../../components/Terminals/TerminalsList/SendLogsModal";
import ModalWindow from "../../components/ModalWindow";
import API from "../../services/api";
import AccessesList from "../../components/Accesses/AccessesList";


class OwnerAccessesContainer extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            terminalID: 0,
            dateStart: "null",
            dateEnd: "null",
            showLoader: false,
            commandSuccess: false,
            reportModal: false
        }
    }

    applyFilters = () => {
        let terminalID = this.childTerminalFilter.validateFields();
        if (terminalID !== null) {
            let result = this.childDateFilter.validateDates();
            if (result !== null) {
                let rawDateStart = result[0];
                let rawDateEnd = result[1];

                let dateStartClear = getISODate(rawDateStart);
                let dateEndClear = getISODate(rawDateEnd);
                this.childList.getCellAttachments(terminalID, dateStartClear, dateEndClear);
            }
        }
    };

    sendReportModal = () => {
        let terminalID = this.childTerminalFilter.validateFields();
        if (terminalID !== null) {
            let result = this.childDateFilter.validateDates();
            if (result !== null) {
                this.setState({reportModal: true});
            }
        }
    };

    closeReportModal = () => {
        this.setState({reportModal: false});
    };

    sendReport = (email) => {
        let terminalID = this.childTerminalFilter.validateFields();
        if (terminalID !== null) {
            let result = this.childDateFilter.validateDates();
            if (result !== null) {
                API.post('sendReport', {
                    reportTypeId: 4,
                    email: email,
                    parameters: {
                        terminalId: Number(terminalID),
                        commandTypeId: 1,
                        dateTimeForm: `${getISODate(result[0])}Z`,
                        dateTimeTo: `${getISODate(result[1])}Z`,
                    }
                })
                    .then(response => {
                        console.log(response);
                        this.setState({reportModal: false, commandSuccess: true, showLoader: false});
                    });
            }
        }
    };

    render() {
        return (
            <React.Fragment>
                <div className="content">
                    <div className="container">
                        <div className="top">
                            <div className="top__left">
                                <Title titleText={window.pageContent['page_header'][this.state.currentLanguage]} titleStyles="caption"/>
                                <Title titleText={window.pageContent['page_subheader'][this.state.currentLanguage]} titleStyles="description"/>
                            </div>
                            <div className="top__right">
                                <a href="" onClick={e => {
                                    e.preventDefault();
                                    this.sendReportModal();
                                }} className="button">{window.pageContent['send_report_text'][this.state.currentLanguage]}</a>
                            </div>
                        </div>

                        <div className="top-group-btns">
                            <PaymentsDateFilter
                                ref={instance => {
                                    this.childDateFilter = instance
                                }}
                            />
                            <PaymentTerminalFilter
                                ref={instance => {
                                    this.childTerminalFilter = instance
                                }}
                            />
                        </div>

                        <div className="filter-button" style={{'marginBottom': '30px'}}>
                            <a href="" onClick={e => {
                                e.preventDefault();
                                this.applyFilters()
                            }} className="button">{window.pageContent['filter_button'][this.state.currentLanguage]}</a>
                        </div>

                        <AccessesList
                            terminalID={this.state.terminalID}
                            dateStart={this.state.dateStart}
                            dateEnd={this.state.dateEnd}
                            ref={instance => {
                                this.childList = instance
                            }}
                        />

                    </div>

                    <Loader showLoader={this.state.showLoader}/>

                    {this.state.reportModal ?
                        <SendLogsModal
                            textTitle={window.pageContent['modal_send_report'][this.state.currentLanguage]}
                            showModal={this.state.reportModal}
                            rejectRequest={this.closeReportModal}
                            confirmRequest={this.sendReport}
                        /> : null}

                    <ModalWindow
                        textTitle={window.pageContent['modal_success'][this.state.currentLanguage]}
                        value="Ok"
                        showModal={this.state.commandSuccess}
                        onClose={(e) => this.setState({commandSuccess: false})}
                    />

                </div>
            </React.Fragment>
        )
    }
}

export default OwnerAccessesContainer;