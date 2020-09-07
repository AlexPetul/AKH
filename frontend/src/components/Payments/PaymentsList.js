import React, {Component} from 'react'
import Loader from "../../controls/Loader";
import API from "../../services/api";
import Moment from "moment";
import ModalWindow from "../ModalWindow";
import EmployeePagination from "../Employees/EmployeePagination";


class PaymentsList extends Component {
    constructor(props) {
        super(props);
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            showLoader: false,
            currentLanguage: currentLanguage,
            payments: [],
            paymentTypes: [],
            errorModal: false,
            itemsPerPage: 0,
            countPages: 0,
            leftBound: 0,
            rightBound: 0,
        }
    }

    componentDidMount() {
        this.setState({
            itemsPerPage: window.itemsPerPage,
            rightBound: window.itemsPerPage
        });
    }

    updateBounds = (newRightBound, newLeftBound) => {
        this.setState({
            rightBound: newRightBound,
            leftBound: newLeftBound
        })
    };

    resetActivePages = () => {
        let elements = document.getElementsByClassName("pagination-page");
        if (elements.length !== 0) {
            [].forEach.call(elements, function (el) {
                el.classList.remove("active-page");
            });
        }
    };

    getPayments = (terminalId, dateStart, dateEnd) => {
        this.setState({showLoader: true}, () => {
            API.get('getPayments',
                {
                    params: {
                        terminalId: Number(terminalId),
                        dateTimeForm: dateStart,
                        dateTimeTo: dateEnd
                    }
                })
                .then(response => {
                    if (response.data.errorCode === 5 || response.data.errorCode === 1) {
                        this.setState({
                            errorModal: true,
                            showLoader: false
                        });
                    } else {
                        let payments = response.data.data.list;
                        let countPages = Math.ceil(payments.length / this.state.itemsPerPage);
                        API.get('getDictionary',
                            {
                                params: {
                                    name: 'paymentTypes'
                                }
                            })
                            .then(response => {
                                this.setState({
                                    showLoader: false,
                                    payments: payments,
                                    paymentTypes: response.data.data,
                                    countPages: countPages
                                });
                            });
                    }
                })
                .catch(error => {
                    this.setState({showLoader: false, errorModal: true});
                    console.log('error', error);
                });
        });
    };

    render() {
        let paymentsListSliced = this.state.payments.slice(
            this.state.leftBound, this.state.rightBound
        );

        if (paymentsListSliced.length === 0) {
            paymentsListSliced = this.state.payments.slice(0, 7)
        }

        return (
            <React.Fragment>
                <div className="table-wrap">
                    <table>
                        <tbody>
                        <tr>
                            <th>{window.pageContent['table_number'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_id'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_service'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_sum'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_type'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_date'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_parameter'][this.state.currentLanguage]}</th>
                        </tr>

                        {paymentsListSliced.map((paymentItem, index) =>
                            <tr key={index}>
                                <td>{paymentItem.id}</td>
                                <td>{paymentItem.paymExtId}</td>
                                <td>{paymentItem.service}</td>
                                <td>{paymentItem.sum}</td>
                                <td>
                                    {this.state.paymentTypes.map((type) =>
                                        type.id === paymentItem.paymentTypeId ? type.name : null
                                    )}
                                </td>
                                <td>{Moment(paymentItem.dateTimeCreate).format('DD.MM.YYYY hh:mm:ss')}</td>
                                <td>
                                    <ul>
                                        {paymentItem.parameters.map((parameter) =>
                                            <li key={parameter.name}>{parameter.name} - {parameter.value}</li>
                                        )}
                                    </ul>
                                </td>
                            </tr>
                        )}

                        </tbody>
                    </table>

                    {this.state.countPages > 1
                        ?
                        <EmployeePagination
                            handleUpdateBounds={this.updateBounds}
                            handleResetActivePages={this.resetActivePages}
                            countPages={this.state.countPages}
                            itemsPerPage={this.state.itemsPerPage}
                            changePage={this.changePage}
                        />
                        :
                        null
                    }

                </div>

                <ModalWindow
                    textTitle="Пожалуйста проверьте правильность введенных данных."
                    value="Ok"
                    showModal={this.state.errorModal}
                    onClose={(e) => this.setState({errorModal: false})}
                />

                <Loader showLoader={this.state.showLoader}/>

            </React.Fragment>
        )
    }
}

export default PaymentsList;