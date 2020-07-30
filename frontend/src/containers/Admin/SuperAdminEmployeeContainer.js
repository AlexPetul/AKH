import React, {Component} from 'react'
import AddEmployee from "../../components/Employees/AddEmployee";
import EmployeesList from "../../components/Employees/EmployeesList";
import EditEmployee from "../../components/Employees/EditEmployee";
import SuperAdminAddEmployee from "../../components/Employees/SuperAdminAddEmployee";


class SuperAdminEmployeeContainer extends Component {
    constructor() {
        super()
        this.state = {
            containerIndex: 0,
            editingEmployee: null
        }
    }

    handleContainerChange = (index, editingEmployee=null) => {
        if (index === 2) {
            this.setState({editingEmployee: editingEmployee})
        }

        this.setState({containerIndex: index})
    }

    render() {
        let isSuperAdmin = window.isSuperAdmin

        if (this.state.containerIndex === 1) {
            if (isSuperAdmin) {
                return (
                    <SuperAdminAddEmployee handleChange={this.handleContainerChange} />
                )
            } else return (
                <AddEmployee handleChange={this.handleContainerChange}/>
            )
        } else if (this.state.containerIndex === 0) {
            return (
                <EmployeesList handleChange={this.handleContainerChange}/>
            )
        } else {
            return (
                <EditEmployee
                    editingEmployee={this.state.editingEmployee}
                    handleChange={this.handleContainerChange}/>
            )
        }
    }
}

export default SuperAdminEmployeeContainer