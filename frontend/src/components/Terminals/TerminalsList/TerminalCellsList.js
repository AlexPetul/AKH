import React, {Component} from 'react'
import API from "../../../services/api";
import EmployeePagination from "../../Employees/EmployeePagination";
import Moment from "moment";
import ConfirmationModal from "./ConfirmationModal";
import ModalWindow from "../../ModalWindow";


class TerminalCellsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cellsList: [],
            allCells: [],
            cellParams: [],
            cellsTypes: [],
            cellsStatuses: [],
            itemsPerPage: 0,
            countPages: 0,
            leftBound: 0,
            rightBound: 0,
            openCellModal: false,
            cellToOpen: null,
            cellToBlockUnblock: null,
            successOpenCellModal: false,
            setCellFree: false,
            blockCellModal: false,
            confirmationMessage: ""
        }
    }

    componentDidMount() {
        this.setState({
            itemsPerPage: window.itemsPerPage,
            rightBound: window.itemsPerPage
        });

        API.get('getCells', {
            params: {
                terminalId: this.props.terminal.id
            }
        })
            .then(response => {
                let cellsList = response.data.data.list;
                let countPages = Math.ceil(cellsList.length / this.state.itemsPerPage);
                API.get('getDictionary', {
                    params: {
                        name: "cellTypes"
                    }
                })
                    .then(response => {
                        let cellTypes = response.data.data;
                        API.get('getDictionary', {
                            params: {
                                name: "cellStatuses"
                            }
                        })
                            .then(response => {
                                let cellsStatuses = response.data.data;
                                API.get('getCellParameters')
                                    .then(response => {
                                        let cellParams = response.data.data;

                                        this.setState({
                                            cellParams: cellParams,
                                            cellsList: cellsList,
                                            allCells: cellsList,
                                            cellsTypes: cellTypes,
                                            cellsStatuses: cellsStatuses,
                                            countPages: countPages
                                        })
                                    });
                            })
                    })
            })
    }

    resetActivePages = () => {
        let elements = document.getElementsByClassName("pagination-page");
        if (elements.length !== 0) {
            [].forEach.call(elements, function (el) {
                el.classList.remove("active-page");
            });
        }
    };

    updateBounds = (newRightBound, newLeftBound) => {
        this.setState({
            rightBound: newRightBound,
            leftBound: newLeftBound
        })
    };

    filterCellsByStatus = (event) => {
        let statusToFilter = event.target.options[event.target.selectedIndex].id
        let filteredList = []
        for (let index = 0; index < this.state.allCells.length; index++) {
            if (this.state.allCells[index].statusId === Number(statusToFilter)) {
                filteredList.push(this.state.allCells[index])
            }
        }

        this.setState({
            cellsList: filteredList,
            countPages: Math.ceil(filteredList.length / this.state.itemsPerPage)
        })
    };

    openCell = (cell) => {
        this.setState({
            openCellModal: true,
            cellToOpen: cell
        })
    };

    rejectDeleteRequest = () => {
        this.setState({setCellFree: false});
        this.sendCommandToCell()
    };

    confirmRequest = (_) => {
        this.setState({setCellFree: true});
        this.sendCommandToCell()
    };

    sendCommandToCell = (_) => {
        API.post('sendCommand', {
            terminalId: this.props.terminal.id,
            commandTypeId: 111,
            parameters: {"cellNumber": this.state.cellToOpen.id, "setCellFree": String(this.state.setCellFree)}
        })
            .then(response => {

                this.setState({
                    openCellModal: false,
                    successOpenCellModal: true
                })
            })
    };

    openModalChangeCellStatus = (cell) => {
        let action = (cell.statusId === 404) ? "разблокировать" : "заблокировать";
        let formattedMessage = `Вы точно хотите ${action} ячейку №${cell.id} ?`;
        this.setState({
            blockCellModal: true,
            confirmationMessage: formattedMessage,
            cellToBlockUnblock: cell
        })
    };

    rejectBlockUnblockCell = () => {
        this.setState({blockCellModal: false})
    };

    blockUnblockCell = (_) => {

    };

    closeModal = () => {
        this.setState({openCellModal: false})
    };


    render() {
        let cellsListSliced = this.state.cellsList.slice(
            this.state.leftBound, this.state.rightBound
        );

        if (cellsListSliced.length === 0) {
            cellsListSliced = this.state.cellsList.slice(0, 7)
        }

        return (
            <React.Fragment>
                <div className="wrap-select">
                    <form>
                        <div className="form__input">
                            <div className="label-input">
                                {window.languageId === 1 ? "Фильтр" : "Filter"}
                            </div>
                            <div className="select">
                                <select onChange={this.filterCellsByStatus}>
                                    {this.state.cellsStatuses.map((cellStatus) =>
                                        <option id={cellStatus.id} key={cellStatus.id}>{cellStatus.name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="table-wrap">
                    <table>
                        <tbody>
                        <tr>
                            <th>{window.pageContent['cells_number'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['cells_pseudonim'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['cells_row'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['cells_column'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['cells_status'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['cells_date_status'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['cells_type'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['cells_parameters'][this.props.currentLanguage]}</th>
                            <th></th>
                        </tr>
                        {cellsListSliced.map((cell) =>
                            <tr key={cell.number}>
                                <td>
                                    <b>{cell.number}</b>
                                </td>
                                <td>
                                    <b>{cell.alias}</b>
                                </td>
                                <td>
                                    <b>{cell.row}</b>
                                </td>
                                <td> {cell.column}</td>
                                <td><span className="active">
                                    {this.state.cellsStatuses.map((cellStatus) =>
                                        cellStatus.id === cell.statusId ? cellStatus.name : null
                                    )}
                                </span></td>
                                <td> {Moment(cell.statusDateTime).format('DD.MM.YYYY hh:mm:ss')}</td>
                                <td>
                                    {this.state.cellsTypes.map((cellType) =>
                                        cellType.id === cell.cellTypeId ? cellType.name : null
                                    )}
                                </td>
                                <td>
                                    {this.state.cellParams.map((cellparam) =>
                                        cellparam.id === cell.cellParameterId ? cellparam.name : null
                                    )}
                                </td>
                                <td>
                                    <div className="tooltip">
                                        <svg className="open-cell" width="20" height="20" viewBox="0 0 20 20"
                                             fill="none"
                                             xmlns="http://www.w3.org/2000/svg" onClick={e => {
                                            e.preventDefault();
                                            this.openCell(cell)
                                        }}>
                                            <path
                                                d="M15.0003 0.833252C12.7003 0.833252 10.8337 2.69992 10.8337 4.99992V6.66658H3.33366C2.41699 6.66658 1.66699 7.40825 1.66699 8.33325V16.6666C1.66699 17.5916 2.41699 18.3333 3.33366 18.3333H13.3337C14.2587 18.3333 15.0003 17.5916 15.0003 16.6666V8.33325C15.0003 7.41658 14.2587 6.66658 13.3337 6.66658H12.5003V4.99992C12.5003 3.61659 13.617 2.49992 15.0003 2.49992C16.3837 2.49992 17.5003 3.61659 17.5003 4.99992V6.66658H19.167V4.99992C19.167 2.69992 17.3003 0.833252 15.0003 0.833252ZM8.33366 10.8333C9.25033 10.8333 10.0003 11.5749 10.0003 12.4999C10.0003 13.4249 9.25866 14.1666 8.33366 14.1666C7.41699 14.1666 6.66699 13.4249 6.66699 12.4999C6.66699 11.5833 7.41699 10.8333 8.33366 10.8333Z"
                                                fill="#42C576"/>
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    {this.state.openCellModal
                        ?
                        <ConfirmationModal
                            textTitle={window.pageContent['modal_open_cell'][this.props.currentLanguage]}
                            closeModal={this.closeModal}
                            showModal={this.state.openCellModal}
                            rejectRequest={this.rejectDeleteRequest}
                            confirmRequest={this.confirmRequest}
                            newStatus="1"
                        />
                        :
                        null
                    }

                    <ModalWindow
                        value="Ok"
                        textTitle={window.pageContent['modal_open_cell_success'][this.props.currentLanguage]}
                        showModal={this.state.successOpenCellModal}
                        onClose={(e) => {
                            this.setState({successOpenCellModal: false});
                        }}
                    />

                    {this.state.blockCellModal
                        ?
                        <ConfirmationModal
                            textTitle={this.state.confirmationMessage}
                            showModal={this.state.blockCellModal}
                            rejectRequest={this.rejectBlockUnblockCell}
                            confirmRequest={this.blockUnblockCell}
                            newStatus="1"
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

                </div>
            </React.Fragment>
        )
    }
}

export default TerminalCellsList