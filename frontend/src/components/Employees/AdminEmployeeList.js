import React, {Component} from 'react'
import API from "../../services/api";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import EmployeePagination from "./EmployeePagination";
import ButtonIcon from "../../controls/ButtonIcon";
import Loader from "../../controls/Loader";
import ChangeUsersStatusModal from "./ChangeUsersStatusModal";
import {ADMIN_EMPLOYEES} from "../../ContantUrls";
import Title from "../../controls/Title";


class AdminEmployeeList extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            showLoader: false,
            employeesList: [],
            userStatuses: [],
            deletingEmployee: null,
            deleteModal: false,
            changeStatusModal: false,
            changingStatusUser: null,
            nextStatus: 0,
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
            API.get('getUsers')
                .then(response => {
                    let emplList = []
                    let rawList = response.data.data.list;
                    for (let index = 0; index < rawList.length; index++) {
                        if ((rawList[index].roleId === 102) || (rawList[index].roleId === 103)) {
                            emplList.push(rawList[index])
                        }
                    }
                    let countPages = Math.ceil(emplList.length / this.state.itemsPerPage)
                    API.get('getDictionary', {
                        params: {
                            name: 'userStatuses'
                        }
                    })
                        .then(response => {
                            this.setState({
                                employeesList: emplList,
                                countPages: countPages,
                                userStatuses: response.data.data,
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
    };

    updateBounds = (newRightBound, newLeftBound) => {
        this.setState({
            rightBound: newRightBound,
            leftBound: newLeftBound
        })
    };

    deleteEmployee(employeeId) {
        const currentEmployee = this.state.employeesList.filter(user => user.id === employeeId);
        this.setState({
            deletingEmployee: currentEmployee[0],
            deleteModal: true
        })
    }

    rejectDelete = () => {
        this.setState({deleteModal: false})
    };

    rejectChangeStatus = () => {
        this.setState({changeStatusModal: false})
    };

    confirmDeleteEmployee = event => {
        let employeeId = this.state.deletingEmployee.id;

        API.post('setUserStatus', {
            sourceId: employeeId,
            statusId: 103,
            statusComment: ""
        })
            .then(response => {
                this.setState({
                    deleteModal: false,
                    deletingEmployee: null
                });
                window.location = ADMIN_EMPLOYEES;
            })
    };

    changeUsersStatus = (event, user) => {
        this.setState({
            changingStatusUser: user,
            changeStatusModal: true,
            nextStatus: event.target.classList.contains("active") ? 101 : 102
        })
    };

    confirmChangeStatus = () => {
        API.post('setUserStatus', {
            sourceId: this.state.changingStatusUser.id,
            statusId: this.state.nextStatus,
            statusComment: ""
        })
            .then(response => {
                window.location = ADMIN_EMPLOYEES;
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
                        {localStorage.getItem('role_id') === '103' ? null :
                            <div className="top__right">
                                <a href="#" onClick={e => {
                                    e.preventDefault();
                                    this.props.handleChange(1)
                                }} className="button">{window.pageContent['add_button_name'][this.state.currentLanguage]}</a>
                            </div>}
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
                                    <th></th>
                                </tr>
                                {employeeListSliced.map((employee, index) =>
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
                                                <div className="radio-wrap">
                                                    {localStorage.getItem('role_id') === '103' ? null :
                                                    <div
                                                        className={employee.statusId === 101 ? 'radio' : 'radio active'}
                                                        onClick={e => {
                                                            this.changeUsersStatus(e, employee)
                                                        }}
                                                    />}
                                                    {this.state.userStatuses.map((status) =>
                                                        status.id === employee.statusId ? status.name : null
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                {localStorage.getItem('role_id') === '103' ? null :
                                                <div className="buttons">
                                                    <ButtonIcon
                                                        className="button-delete"
                                                        handleClick={e => {
                                                            e.preventDefault();
                                                            this.deleteEmployee(employee.id)
                                                        }}
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
                                                </div>}
                                            </td>
                                        </tr>
                                        :
                                        null
                                )}
                            </tbody>
                        </table>
                    </div>

                    {this.state.countPages === 1
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

                <Loader showLoader={this.state.showLoader}/>

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

                {this.state.changeStatusModal
                    ?
                    <ChangeUsersStatusModal
                        user={this.state.changingStatusUser}
                        currentLanguage={this.state.currentLanguage}
                        rejectChanging={this.rejectChangeStatus}
                        nextStatus={this.state.nextStatus}
                        confirmChangeStatus={this.confirmChangeStatus}
                    />
                    :
                    null
                }

            </div>
        )
    }
}

export default AdminEmployeeList
