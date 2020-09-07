import React, {Component} from 'react'
import TerminalGroupsFilter from "../../components/TerminalGroups/TerminalGroupsFilter";
import TerminalGroupsList from "../../components/TerminalGroups/TerminalGroupsList";
import logoutFromSuperAdmin from "../../components/Account/LogoutFromContext";


class TerminalGroupsContainer extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        if (localStorage.getItem('context_id')) {
            logoutFromSuperAdmin();
        }
        this.state = {
            currentLanguage: currentLanguage,
            terminalGroupsList:[],
            allGroups: []
        }
    }

    getTerminalGroups = (groups) => {
        if (this.state.allGroups.length === 0) {
            this.setState({allGroups: groups})
        }

        this.setState({
            terminalGroupsList: groups,
        });
        this.child.updateGroupsList(groups)
    };

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
                    <TerminalGroupsFilter
                        currentLanguage={this.state.currentLanguage}
                        groupsHandler={this.getTerminalGroups}
                        groups={this.state.terminalGroupsList}
                        allGroups={this.state.allGroups}
                    />
                    <TerminalGroupsList
                        currentLanguage={this.state.currentLanguage}
                        ref={instance => {this.child = instance;}}
                        groupsHandler={this.getTerminalGroups}/>
                </div>
            </div>
        )
    }
}

export default TerminalGroupsContainer