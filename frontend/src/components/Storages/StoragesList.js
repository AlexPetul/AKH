import React, {Component} from 'react'
import Loader from "../../controls/Loader";
import API from "../../services/api";
import Moment from "moment";
import ModalWindow from "../ModalWindow";
import EmployeePagination from "../Employees/EmployeePagination";


class StoragesList extends Component {
    constructor(props) {
        super(props);
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            showLoader: false,
            currentLanguage: currentLanguage,
            storage: [],
            storageTypes: [],
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

    getStorages = (terminalId, dateStart, dateEnd) => {
        this.setState({showLoader: true}, () => {
            API.get('getStorages',
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
                        let storage = response.data.data.list;
                        let countPages = Math.ceil(storage.length / this.state.itemsPerPage);
                        API.get('getDictionary',
                            {
                                params: {
                                    name: 'storageStatuses'
                                }
                            })
                            .then(response => {
                                console.log(response);
                                this.setState({
                                    showLoader: false,
                                    storage: storage,
                                    storageTypes: response.data.data,
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
        let storageListSliced = this.state.storage.slice(
            this.state.leftBound, this.state.rightBound
        );

        if (storageListSliced.length === 0) {
            storageListSliced = this.state.storage.slice(0, 7)
        }

        return (
            <React.Fragment>
                <div className="table-wrap">
                    <table>
                        <tbody>
                        <tr>
                            <th>{window.pageContent['table_number'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_id'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_cell'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_tariff'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_start_date'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_end_date'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_sum'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_status'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_messages'][this.state.currentLanguage]}</th>
                        </tr>

                        {storageListSliced.map((storageItem, index) =>
                            <tr key={index}>
                                <td>{storageItem.id}</td>
                                <td>{storageItem.storageExtId}</td>
                                <td>{storageItem.cellNumber}</td>
                                <td>{storageItem.tariffName}</td>
                                {storageItem.dateTimeBegin
                                    ?
                                    <td>{Moment(storageItem.dateTimeBegin).format('DD.MM.YYYY hh:mm:ss')}</td>
                                    :
                                    <td></td>
                                }
                                {storageItem.dateTimeEnd
                                    ?
                                    <td>{Moment(storageItem.dateTimeEnd).format('DD.MM.YYYY hh:mm:ss')}</td>
                                    :
                                    <td></td>
                                }
                                <td>{storageItem.payedSum}</td>
                                <td>
                                    {this.state.storageTypes.map((type) =>
                                        type.id === storageItem.statusId ? type.name : null
                                    )}
                                </td>
                                <td>
                                    <ul>
                                    {storageItem.messages.map((message) =>
                                        <li>{message}</li>
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

export default StoragesList;