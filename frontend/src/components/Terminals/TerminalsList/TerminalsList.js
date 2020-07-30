import React, {Component} from 'react'
import API from "../../../services/api";
import Loader from "../../../controls/Loader";
import EmployeePagination from "../../Employees/EmployeePagination";
import Moment from 'moment'
import ButtonIcon from "../../../controls/ButtonIcon";


class OwnerTerminalsList extends Component {
    constructor() {
        super()
        this.state = {
            list: [],
            terminalStatuses: [],
            showLoader: false,
            itemsPerPage: 0,
            countPages: 0,
            leftBound: 0,
            rightBound: 0,
            statusColors: window.statusColors
        }
    }

    componentDidMount() {
        this.setState({
            itemsPerPage: window.terminalsPerPage,
            rightBound: window.terminalsPerPage
        })

        this.setState({showLoader: true}, () => {
            API.get('getTerminals')
                .then(response => response.data)
                .then(responseData => {
                    let terminalsList = responseData.data.list;
                    let countPages = Math.ceil(terminalsList.length / this.state.itemsPerPage)
                    API.get('getDictionary', {
                        params: {
                            name: 'terminalStatuses'
                        }
                    })
                        .then(response => {
                            let statuses = response.data.data
                            this.setState({
                                list: terminalsList,
                                terminalStatuses: statuses,
                                showLoader: false,
                                countPages: countPages
                            })

                            this.props.setListHandler(terminalsList)
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
    }

    updateBounds = (newRightBound, newLeftBound) => {
        this.setState({
            rightBound: newRightBound,
            leftBound: newLeftBound
        })
    }

    updateTerminalsList(list) {
        this.setState({
            list: list,
            countPages: Math.ceil(list.length / this.state.itemsPerPage)
        })
    }

    render() {
        let terminalsListSliced = this.state.list.slice(
            this.state.leftBound, this.state.rightBound
        );

        if (terminalsListSliced.length === 0) {
            terminalsListSliced = this.state.list.slice(0, 7)
        }

        return (
            <div className="table-wrap owner-terminals">
                <table>
                    <tr>
                        <th>{window.tableNumber}</th>
                        <th>{window.tableAddress}</th>
                        <th>{window.tableToken}</th>
                        <th>{window.tableTokenExpires}</th>
                        <th>{window.tableStatus}</th>
                        <th>{window.tableDateTime}</th>
                        <th>{window.tableCellsCount}</th>
                        <th></th>
                        <th></th>
                    </tr>

                    {terminalsListSliced.map((terminal, index) =>
                        <tr key={index}>
                            <td>№{terminal.number}</td>
                            <td>
                                {terminal.address}
                                <div className="label">
                                </div>
                            </td>
                            <td>
                                {terminal.token}
                            </td>
                            {terminal.expires
                                ?
                                <td>
                                    {Moment(terminal.expires).format('DD.MM.YYYY hh:mm:ss')}
                                </td>
                                :
                                <td></td>
                            }
                            <td>
                                {this.state.terminalStatuses.map((status) =>
                                    status.id === terminal.statusId ?
                                        <span className="status" style={{'color': this.state.statusColors[terminal.statusId]}}>{status.name}</span> : null
                                )}
                            </td>
                            {terminal.statusDateTime ?
                                <td>
                                    {Moment(terminal.statusDateTime).format('DD.MM.YYYY hh:mm:ss')}
                                </td>
                                :
                                <td></td>
                            }
                            <td>
                                <b>Всего {terminal.cellsCount}:</b>
                                <ul className="listBlocks">
                                    <il className="listBlock__item listBlock__item-current">Свободна
                                        - {terminal.cells[0].count}</il>
                                    <il className="listBlock__item listBlock__item-worning ">Занята
                                        - {terminal.cells[1].count}</il>
                                    <il className="listBlock__item listBlock__item-success">Резерв
                                        - {terminal.cells[2].count}</il>
                                    <il className="listBlock__item listBlock__item-error">Блокировка
                                        - {terminal.cells[3].count}</il>
                                </ul>
                            </td>
                            <td>
                                <ButtonIcon
                                    title="Информация о терминале"
                                    className="button-gear"
                                    handleClick={e => {
                                        e.preventDefault();
                                        this.props.terminalDetailedHandler(true, terminal)
                                    }}
                                />
                            </td>
                        </tr>
                    )}
                </table>

                <Loader showLoader={this.state.showLoader}/>

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
        )
    }
}

export default OwnerTerminalsList