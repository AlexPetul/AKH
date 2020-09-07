import React, {Component} from 'react'
import AddEmployee from "../../components/Employees/AddEmployee";
import EmployeesList from "../../components/Employees/EmployeesList";
import EditEmployee from "../../components/Employees/EditEmployee";
import SuperAdminAddEmployee from "../../components/Employees/SuperAdminAddEmployee";
import AdminEmployeeList from "../../components/Employees/AdminEmployeeList";
import SuperAdminEditEmployee from "../../components/Employees/SuperAdminEditEmployee";
import logoutFromSuperAdmin from "../../components/Account/LogoutFromContext";


class OwnerEmployeesContainer extends Component {
    constructor() {
        super()
        this.state = {
            containerIndex: 0,
            editingEmployee: null
        }
    }

    handleContainerChange = (index, editingEmployee = null) => {
        if (index === 2) {
            this.setState({editingEmployee: editingEmployee})
        }

        this.setState({containerIndex: index})
    };

    render() {
        let isSuperAdmin = window.isSuperAdmin;
        if (localStorage.getItem('context_id')) {
            logoutFromSuperAdmin();
        }

        if (this.state.containerIndex === 1) {
            if (isSuperAdmin) {
                return (
                    <SuperAdminAddEmployee handleChange={this.handleContainerChange}/>
                )
            } else return (
                <AddEmployee handleChange={this.handleContainerChange}/>
            )
        } else if (this.state.containerIndex === 0) {
            if ((isSuperAdmin || localStorage.getItem('role_id') === '103') && (!localStorage.getItem('context_id'))) {
                return (
                    <AdminEmployeeList handleChange={this.handleContainerChange}/>
                )
            } else {
                return (
                    <EmployeesList handleChange={this.handleContainerChange}/>
                )
            }
        } else {
            if (isSuperAdmin) {
                return (
                    <SuperAdminEditEmployee
                        editingEmployee={this.state.editingEmployee}
                        handleChange={this.handleContainerChange}
                    />
                )
            } else {
                return (
                    <EditEmployee
                        editingEmployee={this.state.editingEmployee}
                        handleChange={this.handleContainerChange}
                    />
                )
            }
        }
    }
}

export default OwnerEmployeesContainer