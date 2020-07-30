import React, {Component} from 'react'
import API from "../../services/api";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import EmployeePagination from "./EmployeePagination";
import ButtonIcon from "../../controls/ButtonIcon";
import Loader from "../../controls/Loader";


class EmployeesList extends Component {
    constructor() {
        super()
        this.state = {
            employeesList: [],
            showLoader: false,
            deleteModal: false,
            deletingEmployee: null,
            employeesStatuses: [],
            itemsPerPage: 0,
            countPages: 0,
            leftBound: 0,
            rightBound: 0
        }
    }

    componentDidMount() {
        this.setState({
            itemsPerPage: window.employeesPerPage,
            rightBound: window.employeesPerPage
        });

        this.setState({showLoader: true}, () => {
            API.get('getTerminalUsers')
                .then(response => {
                    let emplList = response.data.data.list
                    let countPages = Math.ceil(emplList.length / this.state.itemsPerPage)
                    API.get('getDictionary', {
                        params: {
                            name: 'terminalUserStatuses'
                        }
                    })
                        .then(response => {
                            this.setState({
                                employeesList: emplList,
                                countPages: countPages,
                                employeesStatuses: response.data.data,
                                showLoader: false
                            })
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

    deleteEmployee(employeeId) {
        const currentEmployee = this.state.employeesList.filter(user => user.id === employeeId);
        this.setState({
            deletingEmployee: currentEmployee[0],
            deleteModal: true
        })
    }

    rejectDelete = event => {
        this.setState({deleteModal: false})
    }

    confirmDeleteEmployee = event => {
        let employeeId = this.state.deletingEmployee.id

        API.post('setTerminalUserStatus', {
            sourceId: employeeId,
            statusId: 703,
            statusComment: ""
        })
            .then(response => {
                let selectControl = document.getElementsByClassName("employee-row-" + employeeId);
                selectControl[0].outerHTML = "";
                this.setState({
                    deleteModal: false,
                    deletingEmployee: null
                })
                console.log(response)
            })
    }

    render() {
        const employeeListSliced = this.state.employeesList.slice(
            this.state.leftBound, this.state.rightBound
        );

        return (
            <div className="content">
                <div className="container">
                    <div className="top">
                        <div className="top__left">
                            <div className="caption">
                                {window.pageHeader}
                            </div>
                            <div className="description">
                                {window.pageSubHeader}
                            </div>
                        </div>
                        {window.isAdmin
                            ?
                            null
                            :
                            <div className="top__right">
                                <a href="#" onClick={e => {
                                    e.preventDefault();
                                    this.props.handleChange(1)
                                }} className="button">{window.addEmployeeButton}</a>
                            </div>
                        }
                    </div>
                    <div className="table-wrap">
                        <table>
                            <tr>
                                <th>{window.tableSurname}</th>
                                <th>{window.tableName}</th>
                                <th>{window.tablePatronymic}</th>
                                <th>Email</th>
                                <th>{window.tablePhone}</th>
                                <th>{window.tableStatus}</th>
                                {window.isAdmin ? null : <th></th>}
                            </tr>
                            {employeeListSliced.map((employee, index) =>
                                localStorage.getItem('context_id') ?
                                    <tr key={index} className={"employee-row-" + employee.id}>
                                        <td>
                                            <b>{employee.lastName}</b>
                                        </td>
                                        <td>
                                            <b>{employee.firstName}</b>
                                        </td>
                                        <td>
                                            <b>{employee.surName}</b>
                                        </td>
                                        <td>
                                            {employee.email}
                                        </td>
                                        <td>
                                            {employee.phone}
                                        </td>
                                        <td>
                                            {this.state.employeesStatuses.map((status) =>
                                                status.id === employee.statusId ? status.name : null
                                            )}
                                        </td>
                                        {window.isAdmin
                                            ?
                                            null
                                            :
                                            <td>
                                                <div className="buttons">
                                                    <ButtonIcon
                                                        className="button-delete"
                                                        handleClick={e => {
                                                            e.preventDefault();
                                                            this.deleteEmployee(employee.id)
                                                        }}
                                                        id={employee.id}
                                                        title="Удалить"
                                                    />
                                                    <ButtonIcon
                                                        className="button-edit"
                                                        handleClick={e => {
                                                            e.preventDefault();
                                                            this.props.handleChange(2, employee)
                                                        }}
                                                        id={employee.id}
                                                        title="Редактировать"
                                                    />
                                                </div>
                                            </td>
                                        }
                                    </tr> :
                                    employee.id !== Number(localStorage.getItem('user_id'))
                                        ?
                                        <tr key={index} className={"employee-row-" + employee.id}>
                                            <td>
                                                <b>{employee.lastName}</b>
                                            </td>
                                            <td>
                                                <b>{employee.firstName}</b>
                                            </td>
                                            <td>
                                                <b>{employee.surName}</b>
                                            </td>
                                            <td>
                                                {employee.email}
                                            </td>
                                            <td>
                                                {employee.phone}
                                            </td>
                                            <td>
                                                {this.state.employeesStatuses.map((status) =>
                                                    status.id === employee.statusId ? status.name : null
                                                )}
                                            </td>
                                            {window.isAdmin
                                                ?
                                                null
                                                :
                                                <td>
                                                    <div className="buttons">
                                                        <ButtonIcon
                                                            className="button-delete"
                                                            handleClick={e => {
                                                                e.preventDefault();
                                                                this.deleteEmployee(employee.id)
                                                            }}
                                                            id={employee.id}
                                                            title="Удалить сотрудника"
                                                        />
                                                        <ButtonIcon
                                                            className="button-edit"
                                                            handleClick={e => {
                                                                e.preventDefault();
                                                                this.props.handleChange(2, employee)
                                                            }}
                                                            id={employee.id}
                                                            title="Редактировать сотрудника"
                                                        />
                                                    </div>
                                                </td>
                                            }
                                        </tr>
                                        :
                                        null
                            )}
                        </table>
                    </div>

                    <Loader showLoader={this.state.showLoader}/>

                    {this.state.countPages === 1 || this.state.countPages === 0
                        ?
                        null
                        :
                        <EmployeePagination
                            handleUpdateBounds={this.updateBounds}
                            handleResetActivePages={this.resetActivePages}
                            countPages={this.state.countPages}
                            itemsPerPage={this.state.itemsPerPage}
                            changePage={this.changePage}
                        />
                    }

                </div>

                {this.state.deleteModal
                    ?
                    <DeleteEmployeeModal
                        confirmDelete={this.confirmDeleteEmployee}
                        rejectDelete={this.rejectDelete}
                        user={this.state.deletingEmployee}/>
                    :
                    null
                }

            </div>
        )
    }
}

export default EmployeesList
