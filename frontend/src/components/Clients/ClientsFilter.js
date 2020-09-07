import React, {Component} from 'react'


class ClientsFilter extends Component {
    constructor() {
        super()
    }

    searchQuery = event => {
        event.preventDefault();

        let query = event.target.value;
        let clients = this.props.clients;
        let result = [];
        for (let index = 0; index < clients.length; index++) {
            if ((clients[index].lastName.toLowerCase().includes(query.toLowerCase())) ||
                (clients[index].surName.toLowerCase().includes(query.toLowerCase())) ||
                (clients[index].firstName.toLowerCase().includes(query.toLowerCase()))) {
                result.push(clients[index])
            }
        }
        this.props.searchHandler(result);
    };

    render() {
        return (
            <div className="filter">
                <div className="form form_filter">
                    <form>
                        <div className="form__input">
                            <div className="label-input">
                                {window.pageContent['filter_full_name'][this.props.currentLanguage]}
                            </div>
                            <input
                                type="text"
                                onChange={this.searchQuery}
                                className="input input_mini"
                            />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default ClientsFilter;