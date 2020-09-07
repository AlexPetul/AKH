import React, {Component} from 'react'
import API from "../../../services/api";
import Loader from "../../../controls/Loader";
import EmployeePagination from "../../Employees/EmployeePagination";
import TerminalTableRow from "./TerminalTableRow";


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
        });

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
                            });

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
    };

    updateBounds = (newRightBound, newLeftBound) => {
        this.setState({
            rightBound: newRightBound,
            leftBound: newLeftBound
        })
    };

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
                    <tbody>
                    <tr>
                        <th>{window.pageContent['table_number'][this.props.currentLanguage]}</th>
                        <th>{window.pageContent['table_address'][this.props.currentLanguage]}</th>
                        <th>{window.pageContent['table_key'][this.props.currentLanguage]}</th>
                        <th>{window.pageContent['table_key_expires'][this.props.currentLanguage]}</th>
                        <th>{window.pageContent['table_status'][this.props.currentLanguage]}</th>
                        <th>{window.pageContent['table_datetime'][this.props.currentLanguage]}</th>
                        <th>{window.pageContent['table_cells_count'][this.props.currentLanguage]}</th>
                        <th></th>
                        <th></th>
                    </tr>

                    {terminalsListSliced.map((terminal, index) =>
                        <TerminalTableRow
                            currentLanguage={this.props.currentLanguage}
                            key={index}
                            terminal={terminal}
                            statuses={this.state.terminalStatuses}
                            colors={this.state.statusColors}
                            getTerminalInfo={this.props.terminalDetailedHandler}
                        />
                    )}
                    </tbody>
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