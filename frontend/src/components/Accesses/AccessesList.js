import React, {Component} from 'react'
import Loader from "../../controls/Loader";
import API from "../../services/api";
import Moment from "moment";
import ModalWindow from "../ModalWindow";
import EmployeePagination from "../Employees/EmployeePagination";


class AccessesList extends Component {
    constructor(props) {
        super(props);
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            showLoader: false,
            cellAttachments: [],
            cellAttachmentStatuses: [],
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

    getCellAttachments = (terminalId, dateStart, dateEnd) => {
        this.setState({showLoader: true}, () => {
            API.get('getCellAttachments',
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
                        let cellAttachments = response.data.data.list;
                        let countPages = Math.ceil(cellAttachments.length / this.state.itemsPerPage);
                        API.get('getDictionary',
                            {
                                params: {
                                    name: 'cellAttachmentStatuses'
                                }
                            })
                            .then(response => {
                                this.setState({
                                    showLoader: false,
                                    cellAttachments: cellAttachments,
                                    cellAttachmentStatuses: response.data.data,
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
        let cellsListSliced = this.state.cellAttachments.slice(
            this.state.leftBound, this.state.rightBound
        );

        if (cellsListSliced.length === 0) {
            cellsListSliced = this.state.cellAttachments.slice(0, 7)
        }

        return (
            <React.Fragment>
                <div className="table-wrap">
                    <table>
                        <tbody>
                        <tr>
                            <th>№</th>
                            <th>{window.pageContent['table_surname'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_name'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_patronymic'][this.state.currentLanguage]}</th>
                            <th>Email</th>
                            <th>{window.pageContent['table_phone'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_cell'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_status'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_status_datetime'][this.state.currentLanguage]}</th>
                        </tr>

                        {cellsListSliced.map((item, index) =>
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.lastName}</td>
                                <td>{item.firstName}</td>
                                <td>{item.surName}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td>{item.cellNumber}</td>
                                <td>
                                    {this.state.cellAttachmentStatuses.map((stat) =>
                                        stat.id === item.statusId ? stat.name : null
                                    )}
                                </td>
                                <td>{Moment(item.statusDateTime).format('DD.MM.YYYY hh:mm:ss')}</td>
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

export default AccessesList;