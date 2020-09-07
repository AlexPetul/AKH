import React, {Component} from 'react'
import Loader from "../../controls/Loader";
import API from "../../services/api";
import Moment from "moment";
import EmployeePagination from "../Employees/EmployeePagination";
import ButtonIcon from "../../controls/ButtonIcon";
import ModalWindow from "../ModalWindow";
import ConfirmationModal from "../Terminals/TerminalsList/ConfirmationModal";


class TariffsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            tariffs: [],
            storageTypes: [],
            deleteModal: false,
            successModal: false,
            deletingTariff: 0,
            errorModal: false,
            itemsPerPage: 0,
            countPages: 0,
            leftBound: 0,
            rightBound: 0,
        }
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

    componentDidMount() {
        this.setState({
            itemsPerPage: window.itemsPerPage,
            rightBound: window.itemsPerPage
        });

        this.setState({showLoader: true}, () => {
            API.get('getTariffs')
                .then(response => {
                    let tariffs = response.data.data.list;
                    for (let index = 0; index < tariffs.length; index++) {
                        let interval = tariffs[index].interval;
                        if (interval < 60) {
                            tariffs[index].clearInterval = `${tariffs[index].interval} мин.`;
                        } else if (interval >= 60 && interval < 1440) {
                            let newInterval = tariffs[index].interval / 60;
                            tariffs[index].clearInterval = `${newInterval} ч.`;
                        } else if (interval >= 1440) {
                            let newInterval = tariffs[index].interval / 1440;
                            tariffs[index].clearInterval = `${newInterval} д.`;
                        }
                    }
                    let countPages = Math.ceil(tariffs.length / this.state.itemsPerPage);
                    this.setState({
                        tariffs: tariffs,
                        showLoader: false,
                        countPages: countPages
                    })
                })
        });
    };

    openDeleteModal = (tariffId) => {
        this.setState({deletingTariff: tariffId, deleteModal: true});
    };

    confirmRequest = () => {
        API.post('deleteTariff', {
            id: this.state.deletingTariff
        })
            .then(response => {
                this.setState({
                    deleteModal: false,
                    successModal: true
                });
            });
    };

    rejectDeleteRequest = () => {
        this.setState({deleteModal: false});
    };

    render() {
        let tariffsListSliced = this.state.tariffs.slice(
            this.state.leftBound, this.state.rightBound
        );

        if (tariffsListSliced.length === 0) {
            tariffsListSliced = this.state.tariffs.slice(0, 7)
        }

        return (
            <React.Fragment>
                <div className="table-wrap">
                    <table>
                        <tbody>
                        <tr>
                            <th>{window.pageContent['table_number'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_name'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_interval'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_price'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_status'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_status_datetime'][this.props.currentLanguage]}</th>
                            <th></th>
                        </tr>

                        {tariffsListSliced.map((tariff, index) =>
                            <tr key={index}>
                                <td>{tariff.id}</td>
                                <td>{tariff.name}</td>
                                <td>{tariff.clearInterval}</td>
                                <td>{tariff.price}</td>
                                <td>{tariff.statusId}</td>
                                <td>{Moment(tariff.statusDateTime).format('DD.MM.YYYY hh:mm:ss')}</td>
                                <td>
                                    <div className="buttons">
                                        <ButtonIcon
                                            className="button-delete"
                                            handleClick={e => {
                                                e.preventDefault();
                                                this.openDeleteModal(tariff.id);
                                            }}
                                            title="Удалить"
                                        />
                                        <ButtonIcon
                                            className="button-gear"
                                            handleClick={e => {
                                                e.preventDefault();
                                                this.props.changeContainerIndex(3, tariff);
                                            }}
                                            title="Редактировать"
                                        />
                                    </div>
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

                {this.state.deleteModal
                    ?
                    <ConfirmationModal
                        textTitle={window.pageContent['delete_tariff'][this.props.currentLanguage]}
                        showModal={this.state.deleteModal}
                        rejectRequest={this.rejectDeleteRequest}
                        confirmRequest={this.confirmRequest}
                        newStatus=""
                    />
                    :
                    null
                }

                <ModalWindow
                    textTitle={window.pageContent['success_delete'][this.props.currentLanguage]}
                    value="Ok"
                    showModal={this.state.successModal}
                    onClose={(e) => {
                        this.setState({
                            successModal: false
                        });
                        window.location = '/owner/tariffs/';
                    }
                    }
                />

                <Loader showLoader={this.state.showLoader}/>

            </React.Fragment>
        )
    }
}

export default TariffsList;