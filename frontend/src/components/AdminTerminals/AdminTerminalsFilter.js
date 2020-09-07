import React, {Component, useState} from 'react'


class AdminTerminalsFilter extends Component {
    constructor() {
        super()
    }

    searchQuery = event => {
        event.preventDefault();

        let query = event.target.value;
        let groups = this.props.allGroups;
        let result = [];
        for (let index = 0; index < groups.length; index++) {
            if (groups[index].terminalGroupName.toLowerCase().includes(query.toLowerCase())) {
                result.push(groups[index])
            }
        }
        this.props.groupsHandler(result)
    };

    render() {
        return (
            <div className="filter">
                <div className="form form_filter">
                    <form>
                        <div className="form__input">
                            <div className="label-input">
                                {window.pageContent['filter_text'][this.props.currentLanguage]}
                            </div>
                            <input
                                type="text"
                                onChange={this.searchQuery}
                                className="input input_mini"
                                placeholder={window.languageId === 1 ? "Введите название" : "Input name"}/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AdminTerminalsFilter