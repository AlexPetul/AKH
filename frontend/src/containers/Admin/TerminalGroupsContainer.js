import React, {Component} from 'react'
import TerminalGroupsFilter from "../../components/TerminalGroups/TerminalGroupsFilter";
import TerminalGroupsList from "../../components/TerminalGroups/TerminalGroupsList";


class TerminalGroupsContainer extends Component {
    constructor() {
        super()
        this.state = {
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
        })
        this.child.updateGroupsList(groups)
    }

    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="top">
                        <div className="top__left">
                            <div className="caption">
                                {window.pageHeader}
                            </div>
                            <div className="description">
                                Просмотр групп терминалов и управление ими
                            </div>
                        </div>
                    </div>
                    <TerminalGroupsFilter
                        groupsHandler={this.getTerminalGroups}
                        groups={this.state.terminalGroupsList}
                        allGroups={this.state.allGroups}
                    />
                    <TerminalGroupsList
                        ref={instance => {this.child = instance;}}
                        groupsHandler={this.getTerminalGroups}/>
                </div>
            </div>
        )
    }
}

export default TerminalGroupsContainer