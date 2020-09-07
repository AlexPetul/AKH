import React, {Component} from 'react'
import EmployeePagination from "../Employees/EmployeePagination";


class ClientsList extends Component {
    constructor() {
        super();
        this.state = {
            clients: [],
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

    setList = (clients) => {
        let countPages = Math.ceil(clients.length / this.state.itemsPerPage);
        this.setState({countPages: countPages, clients: clients})
    };

    render() {

        let clientsListSliced = this.state.clients.slice(
            this.state.leftBound, this.state.rightBound
        );

        if (clientsListSliced.length === 0) {
            clientsListSliced = this.state.clients.slice(0, 7)
        }

        return (
            <div className="table-wrap">
                <table className="collections_table">
                    <tbody>
                    <tr>
                        <th>№</th>
                        <th>{window.pageContent['table_surname'][this.props.currentLanguage]}</th>
                        <th>{window.pageContent['table_name'][this.props.currentLanguage]}</th>
                        <th>{window.pageContent['table_patronymic'][this.props.currentLanguage]}</th>
                        <th>Email</th>
                        <th>{window.pageContent['table_identity'][this.props.currentLanguage]}</th>
                        <th>{window.pageContent['table_phone'][this.props.currentLanguage]}</th>
                        <th>{window.pageContent['table_cells'][this.props.currentLanguage]}</th>
                    </tr>
                    {clientsListSliced.map((client, index) =>
                        <tr key={index}>
                            <td>
                                <b>{client.number}</b>
                            </td>
                            <td>
                                <b>{client.lastName}</b>
                            </td>
                            <td>
                                <b>{client.firstName}</b>
                            </td>
                            <td>
                                <b>{client.surName}</b>
                            </td>
                            <td>
                                {client.email}
                            </td>
                            <td>
                                {client.identity}
                            </td>
                            <td>
                                {client.phone}
                            </td>
                            <td className="bills__count">
                                {client.cells.map((cell) =>
                                    <ul className="listBlocks">
                                        <li className="listBlock__item listBlock__item-current">№ Терминала
                                            - {cell.terminalNumber}</li>
                                        <li className="listBlock__item listBlock__item-current">№ Ячейки
                                            - {cell.cellNumber}</li>
                                    </ul>
                                )}
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
        )
    }
}

export default ClientsList;