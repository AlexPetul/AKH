import React, {Component} from 'react'
import API from "../../services/api";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import EmployeePagination from "./EmployeePagination";
import ButtonIcon from "../../controls/ButtonIcon";
import Loader from "../../controls/Loader";
import Title from "../../controls/Title";
import {OWNER_EMPLOYEES} from "../../ContantUrls";


class EmployeesList extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
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
    };

    confirmDeleteEmployee = event => {
        let employeeId = this.state.deletingEmployee.id

        API.post('setTerminalUserStatus', {
            sourceId: employeeId,
            statusId: 703,
            statusComment: ""
        })
            .then(response => {
                this.setState({
                    deleteModal: false,
                    deletingEmployee: null
                });
                window.location = OWNER_EMPLOYEES;
            })
    };

    render() {
        const employeeListSliced = this.state.employeesList.slice(
            this.state.leftBound, this.state.rightBound
        );

        return (
            <div className="content">
                <div className="container">
                    <div className="top">
                        <div className="top__left">
                            <Title titleText={window.pageContent['page_header'][this.state.currentLanguage]} titleStyles='caption'/>
                            <Title titleText={window.pageContent['page_subheader'][this.state.currentLanguage]} titleStyles='description'/>
                        </div>
                        {window.isAdmin
                            ?
                            null
                            :
                            <div className="top__right">
                                <a href="" onClick={e => {
                                    e.preventDefault();
                                    this.props.handleChange(1)
                                }} className="button">{window.pageContent['add_button_name'][this.state.currentLanguage]}</a>
                            </div>
                        }
                    </div>
                    <div className="table-wrap">
                        <table>
                            <tbody>
                            <tr>
                                <th>{window.pageContent['table_surname'][this.state.currentLanguage]}</th>
                                <th>{window.pageContent['table_name'][this.state.currentLanguage]}</th>
                                <th>{window.pageContent['table_patronymic'][this.state.currentLanguage]}</th>
                                <th>Email</th>
                                <th>{window.pageContent['table_phone'][this.state.currentLanguage]}</th>
                                <th>{window.pageContent['table_status'][this.state.currentLanguage]}</th>
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
                            </tbody>
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
                        currentLanguage={this.state.currentLanguage}
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
