import React, {Component} from 'react'
import API from "../../services/api";
import AdminTerminalsFilter from "../../components/AdminTerminals/AdminTerminalsFilter";
import AdminTerminalsList from "../../components/AdminTerminals/AdminTerminalsList";
import logoutFromSuperAdmin from "../../components/Account/LogoutFromContext";


class AdminTerminalsContainer extends Component {
    constructor() {
        super()
        if (localStorage.getItem('context_id')) {
            logoutFromSuperAdmin();
        }
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            terminalGroupsList: [],
            allGroups: [],
            allowedTerminalStatuses: []
        }
    }

    componentDidMount() {
        API.get('getDictionary', {
            params: {
                name: 'terminalStatuses'
            }
        })
            .then(response => {
                let statuses = response.data.data

                this.setState({
                    allowedTerminalStatuses: statuses
                });
            })
    }

    getTerminalGroups = (groups) => {
        if (this.state.allGroups.length === 0) {
            this.setState({allGroups: groups})
        }

        this.setState({
            terminalGroupsList: groups,
        })
        this.child.updateGroupsList(groups)
    }

    filterTerminalsByStatus = (event) => {
        let statusToFilter = event.target.options[event.target.selectedIndex].id;
        let filteredList = [];
        if (statusToFilter === "all") {
            filteredList = this.state.terminalGroupsList
        } else {
            for (let index = 0; index < this.state.terminalGroupsList.length; index++) {
                if (this.state.terminalGroupsList[index].statusId === Number(statusToFilter)) {
                    filteredList.push(this.state.terminalGroupsList[index])
                }
            }
        }

        this.child.updateGroupsList(filteredList)
    }

    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="top">
                        <div className="top__left">
                            <div className="caption">
                                {window.pageContent['page_header'][this.state.currentLanguage]}
                            </div>
                            <div className="description">
                                {window.pageContent['page_subheader'][this.state.currentLanguage]}
                            </div>
                        </div>
                    </div>

                    <div className="top-group-btns">
                        <AdminTerminalsFilter
                            currentLanguage={this.state.currentLanguage}
                            groupsHandler={this.getTerminalGroups}
                            groups={this.state.terminalGroupsList}
                            allGroups={this.state.allGroups}
                        />
                        <form>
                            <div className="form__input">
                                <div className="label-input">
                                    {window.languageId === 1 ? "Фильтр" : "Filter"}
                                </div>
                                <div className="select">
                                    <select className="status-filter" onChange={this.filterTerminalsByStatus}>
                                        {this.state.allowedTerminalStatuses.map((status, index) =>
                                            (index === 0
                                                    ?
                                                    <option id="all" key="all">{window.languageId === 1 ? "Все" : "All"}</option>
                                                    :
                                                    ((status.id !== 301) && (status.id !== 305))
                                                        ?
                                                        <option id={status.id} key={status.id}>{status.name}</option>
                                                        :
                                                        null
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    <AdminTerminalsList
                        currentLanguage={this.state.currentLanguage}
                        ref={instance => {
                            this.child = instance;
                        }}
                        groupsHandler={this.getTerminalGroups}
                    />

                </div>
            </div>
        )
    }
}

export default AdminTerminalsContainer