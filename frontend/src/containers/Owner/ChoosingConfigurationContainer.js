import React, {Component} from 'react'
import API from '../../services/api';
import {LOGIN_PATH, OWNER_MAIN} from "../../ContantUrls";
import Loader from "../../controls/Loader";
import ConfigurationItem from "../../components/ChosingConfiguration/ConfigurationItem";


class ChoosingConfigurationContainer extends Component {
    constructor() {
        super();
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            showLoader: false,
            currentLanguage: currentLanguage,
            configurations: [],
            configIcons: window.configIcons,
        }
    }

    componentDidMount() {
        if (!localStorage.getItem('token')) {
            window.location = LOGIN_PATH;
        }

        this.setState({showLoader: true}, () => {
            API.get('getDictionary', {
                params: {
                    name: 'configurations'
                }
            })
                .then(response => {
                    let configurations = response.data.data;
                    this.setState({configurations: configurations, showLoader: false})
                });
        });
    }

    chooseConfigAKH = (configId) => {
        let terminalGroupId = parseInt(localStorage.getItem('context_id'), 10);
        if (!terminalGroupId) {
            terminalGroupId = parseInt(localStorage.getItem('group_id'), 10)
        }

        API.post(window.apiLinks[0].short_name, {id: terminalGroupId, configurationId: configId})
            .then(response => {
                localStorage.setItem('config_id', configId);
                fetch('/save-configuration/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: {}
                })
                    .then(response => {
                        window.location = OWNER_MAIN;
                    });
            })
    }

    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="caption">
                        {window.pageContent['page_header'][this.state.currentLanguage]}
                    </div>
                    <div className="selectCongig">
                        {this.state.configurations.map((config, index) =>
                            <ConfigurationItem
                                key={index}
                                icon={this.state.configIcons[config.id]}
                                config={config}
                                chooseConfig={this.chooseConfigAKH}
                                currentLanguage={this.state.currentLanguage}
                            />
                        )}
                    </div>
                </div>

                <Loader showLoader={this.state.showLoader}/>

            </div>
        )
    }
}

export default ChoosingConfigurationContainer