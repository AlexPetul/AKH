import React, {Component} from 'react'
import API from "../../services/api";
import EmployeePagination from "../Employees/EmployeePagination";
import Loader from "../../controls/Loader";
import TerminalGroupModal from "./TerminalGroupModal";
import ButtonIcon from "../../controls/ButtonIcon";
import {OWNER_MAIN} from "../../ContantUrls";


class TerminalGroupsList extends Component {
    constructor() {
        super()
        this.state = {
            groupsList: [],
            editGroup: false,
            showLoader: false,
            editingGroup: null,
            editGroupOwnerInfo: null,
            configurations: [],
            countTerminalGroups: 0,
            itemsPerPage: 0,
            countPages: 0,
            leftBound: 0,
            rightBound: 0
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

    componentDidMount() {
        this.setState({
            itemsPerPage: window.employeesPerPage,
            rightBound: window.employeesPerPage
        });

        this.setState({showLoader: true}, () => {
            API.get('getTerminalGroups')
                .then(response => {
                    let terminalGroups = response.data.data.list;
                    let countPages = Math.ceil(terminalGroups.length / this.state.itemsPerPage);
                    API.get('getDictionary', {
                        params: {
                            name: 'configurations'
                        }
                    })
                        .then(result => {
                            let configurations = result.data.data;

                            this.setState({
                                groupsList: terminalGroups,
                                configurations: configurations,
                                countPages: countPages,
                                countTerminalGroups: terminalGroups.length
                            });
                            this.props.groupsHandler(terminalGroups);
                            this.setState({showLoader: false})
                        })
                })
        })
    }

    updateGroupsList(groups) {
        this.setState({
            groupsList: groups,
            countPages: Math.ceil(groups.length / this.state.itemsPerPage)
        })
    }

    editTerminalGroup = (terminalGroup, owner) => {
        this.setState({
            editGroup: true,
            editingGroup: terminalGroup,
            editGroupOwnerInfo: owner
        })
    };

    rejectEditing = () => {
        this.setState({
            editGroup: false,
            editingGroup: null
        })
    };

    confirmEditing = (name, description) => {
        API.post('updateTerminalGroup', {
            id: this.state.editingGroup.id,
            name: name,
            description: description
        })
            .then(response => {
                for (let index = 0; index < this.state.groupsList.length; index++) {
                    if (this.state.groupsList[index].id === this.state.editingGroup.id) {
                        this.state.groupsList[index].name = name
                        this.state.groupsList[index].description = description
                        this.rejectEditing()
                        break
                    }
                }
            })
    };

    switchContext = (groupId) => {
        localStorage.setItem('context_id', groupId);
        fetch('/save-context/', {
            method: 'POST',
            body: JSON.stringify({context_id: groupId}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                window.location = OWNER_MAIN;
            });
    };

    render() {
        let employeeListSliced = this.state.groupsList.slice(
            this.state.leftBound, this.state.rightBound
        );

        if (employeeListSliced.length === 0) {
            employeeListSliced = this.state.groupsList.slice(0, 7)
        }

        return (
            <React.Fragment>
                <div className="table-wrap">
                    <table>
                        <tbody>
                        <tr>
                            <th>{window.pageContent['table_name'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_fio'][this.props.currentLanguage]}</th>
                            <th>Email</th>
                            <th>{window.pageContent['table_phone'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_configuration'][this.props.currentLanguage]}</th>
                            <th></th>
                        </tr>
                        {employeeListSliced.map((terminalGroup, index) =>
                            <tr key={terminalGroup.id}>
                                <td>
                                    <b>{terminalGroup.name}</b>
                                </td>
                                <td>
                                    {terminalGroup.users[0].lastName} {terminalGroup.users[0].firstName} {terminalGroup.users[0].surName}
                                </td>
                                <td>
                                    {terminalGroup.users[0].email}
                                </td>
                                <td>
                                    {terminalGroup.users[0].phone}
                                </td>
                                <td>
                                    {this.state.configurations.map((config, ind) =>
                                        config.id === terminalGroup.configurationId ? config.name : null
                                    )}
                                </td>
                                <td>
                                    <div className="buttons">
                                        <ButtonIcon
                                            className="button-edit"
                                            handleClick={e => {
                                                e.preventDefault();
                                                this.editTerminalGroup(terminalGroup, terminalGroup.users[0])
                                            }}
                                            title="Редактировать"
                                        />
                                        <ButtonIcon
                                            className="button-case"
                                            handleClick={e => {
                                                e.preventDefault();
                                                this.switchContext(terminalGroup.id)
                                            }}
                                            title="Перейти в кабинет"
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

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

                {this.state.editGroup
                    ?
                    <TerminalGroupModal
                        currentLanguage={this.props.currentLanguage}
                        group={this.state.editingGroup}
                        owner={this.state.editGroupOwnerInfo}
                        confirmEditing={this.confirmEditing}
                        rejectEditing={this.rejectEditing}
                    />
                    :
                    null
                }

            </React.Fragment>
        )
    }
}

export default TerminalGroupsList