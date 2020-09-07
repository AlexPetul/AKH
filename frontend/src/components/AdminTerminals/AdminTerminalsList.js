import React, {Component} from 'react'
import API from "../../services/api";
import EmployeePagination from "../Employees/EmployeePagination";
import Loader from "../../controls/Loader";
import AdminTerminalsModal from "./AdminTerminalsModal";
import Moment from "moment";
import ButtonIcon from "../../controls/ButtonIcon";


class AdminTerminalsList extends Component {
    constructor() {
        super()
        this.state = {
            terminalsList: [],
            showLoader: false,
            activationModal: false,
            editingTerminal: null,
            configurations: [],
            terminalStatuses: [],
            itemsPerPage: 0,
            countPages: 0,
            leftBound: 0,
            rightBound: 0,
            currentDate: "",
            colors: window.statusColors
        }
    }

    resetActivePages = () => {
        let elements = document.getElementsByClassName("pagination-page");
        if (elements.length !== 0) {
            [].forEach.call(elements, function (el) {
                el.classList.remove("active-page");
            });
        }
    }

    updateBounds = (newRightBound, newLeftBound) => {
        this.setState({
            rightBound: newRightBound,
            leftBound: newLeftBound
        })
    }

    getActivationDate() {
        var today = new Date()
        today.setDate(today.getDate() + window.keyActivationTime);
        let dd = String(today.getDate());
        if (Number(dd) < 10) {
            dd = '0' + dd
        }
        let mm = String(today.getMonth() + 1);
        if (Number(mm) < 10) {
            mm = '0' + mm
        }
        let yyyy = today.getFullYear();
        today = dd + '.' + mm + '.' + yyyy;
        return today
    }

    componentDidMount() {
        this.setState({
            itemsPerPage: window.terminalsPerPage,
            rightBound: window.terminalsPerPage
        })

        this.setState({showLoader: true}, () => {
            API.get('getTerminals')
                .then(response => {
                    let terminalsList = response.data.data.list
                    terminalsList = terminalsList.filter(terminal => (terminal.statusId !== 301) && (terminal.statusId !== 305));
                    let countPages = Math.ceil(terminalsList.length / this.state.itemsPerPage)
                    API.get('getDictionary', {
                        params: {
                            name: 'configurations'
                        }
                    })
                        .then(result => {
                            let configurations = result.data.data
                            API.get('getDictionary', {
                                params: {
                                    name: 'terminalStatuses'
                                }
                            })
                                .then(result => {
                                    let terminalStatuses = result.data.data
                                    let activationDate = this.getActivationDate()

                                    this.setState({
                                        terminalsList: terminalsList,
                                        configurations: configurations,
                                        terminalStatuses: terminalStatuses,
                                        countPages: countPages,
                                        countTerminalGroups: terminalsList.length,
                                        showLoader: false,
                                        currentDate: activationDate
                                    })

                                    this.props.groupsHandler(terminalsList)
                                })
                        })
                })
        })
    }

    updateGroupsList(groups) {
        this.setState({
            terminalsList: groups,
            countPages: Math.ceil(groups.length / this.state.itemsPerPage)
        })
    }

    changeTerminalStatus(terminal) {
        this.setState({
            activationModal: true,
            editingTerminal: terminal
        })
    }

    rejectChangeTerminalStatus = () => {
        this.setState({
            activationModal: false
        })
    }

    render() {
        let terminalsListSliced = this.state.terminalsList.slice(
            this.state.leftBound, this.state.rightBound
        )

        if (terminalsListSliced.length === 0) {
            terminalsListSliced = this.state.terminalsList.slice(0, 7)
        }

        return (
            <React.Fragment>
                <div className="table-wrap">
                    <table>
                        <tbody>
                        <tr>
                            <th>{window.pageContent['table_number'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_name'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_address'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_config'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_key'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_key_expires'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_status'][this.props.currentLanguage]}</th>
                            <th></th>
                        </tr>

                        {terminalsListSliced.map((terminal, ind) =>
                            <tr key={terminal.id}>
                                <td>{terminal.number}</td>
                                <td>{terminal.terminalGroupName}</td>
                                <td>
                                    {terminal.address}
                                    <div className="label">

                                    </div>
                                </td>
                                <td>
                                    {this.state.configurations.map((config) =>
                                        config.id === terminal.configurationId ? config.name : null
                                    )}
                                </td>
                                <td>
                                    {terminal.token}
                                </td>
                                {terminal.expires
                                    ?
                                    <td>{Moment(terminal.expires).format('DD.MM.YYYY hh:mm:ss')}</td>
                                    :
                                    <td></td>
                                }
                                <td>
                                    <div className="radio-wrap">
                                        {this.state.terminalStatuses.map((status, status_index) =>
                                            status.id === terminal.statusId ?
                                                <span key={status_index} className="status"
                                                      style={{'color': this.state.colors[terminal.statusId]}}>{status.name}</span> : null
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <ButtonIcon
                                        className="button-gear"
                                        handleClick={e => {
                                            e.preventDefault();
                                            this.changeTerminalStatus(terminal)
                                        }}
                                        title="Параметры активации"
                                    />
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <Loader showLoader={this.state.showLoader}/>

                {this.state.activationModal
                    ?
                    <AdminTerminalsModal
                        currentLanguage={this.props.currentLanguage}
                        rejectChanging={this.rejectChangeTerminalStatus}
                        terminal={this.state.editingTerminal}
                        activationDate={this.state.currentDate}
                    />
                    :
                    null
                }

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

            </React.Fragment>
        )
    }
}

export default AdminTerminalsList