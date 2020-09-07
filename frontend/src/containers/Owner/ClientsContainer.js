import React, {Component} from 'react'
import Title from "../../controls/Title";
import ClientsList from "../../components/Clients/ClientsList";
import API from "../../services/api";
import Loader from "../../controls/Loader";
import ModalWindow from "../../components/ModalWindow";
import ClientsFilter from "../../components/Clients/ClientsFilter";
import TerminalGroupsFilter from "../../components/TerminalGroups/TerminalGroupsFilter";


class ClientsContainer extends Component {
    constructor() {
        super();
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            currentLanguage: currentLanguage,
            clients: [],
            showLoader: false,
            errorModal: false
        }
    }

    componentDidMount() {
        this.setState({showLoader: true}, () => {
            API.get('getClients')
                .then(response => {
                    let clients = response.data.data.list;
                    this.setState({clients: clients, showLoader: false});
                    this.child.setList(clients);
                });
        });
    }

    importClients = () => {
        document.getElementById('clients_file').click();
    };

    fileChanged = () => {
        let fileInput = document.getElementById('clients_file');
        let clientsFile = fileInput.files[0];
        let reader = new FileReader();
        reader.readAsText(clientsFile);
        reader.onload =  () => {
            try {
                let res = JSON.parse(reader.result.toString());
                API.post('updateClients', res)
                    .then(response => {
                        console.log(response);
                        window.location = '/owner/clients/';
                    });
            } catch (e) {
                this.setState({errorModal: true});
            }
        };
    };

    updateList = (clientList) => {
        this.child.setList(clientList);
    };

    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="top">
                        <div className="top__left">
                            <Title titleText={window.pageContent['page_header'][this.state.currentLanguage]} titleStyles='caption'/>
                            <Title titleText={window.pageContent['page_subheader'][this.state.currentLanguage]} titleStyles='description'/>
                        </div>
                        <div className="top__right">
                            <input onChange={this.fileChanged} id="clients_file" type="file"
                                   style={{'display': 'none'}}/>
                            <a href="" onClick={e => {
                                e.preventDefault();
                                this.importClients();
                            }} className="button">{window.pageContent['import_button'][this.state.currentLanguage]}</a>
                        </div>
                    </div>

                    <ClientsFilter
                        currentLanguage={this.state.currentLanguage}
                        searchHandler={this.updateList}
                        clients={this.state.clients}
                    />

                    <ClientsList
                        currentLanguage={this.state.currentLanguage}
                        ref={instance => {
                            this.child = instance
                        }}
                    />

                </div>

                <Loader showLoader={this.state.showLoader}/>

                <ModalWindow
                    textTitle={window.pageContent['file_error'][this.state.currentLanguage]}
                    value="Ok"
                    showModal={this.state.errorModal}
                    onClose={(e) => this.setState({errorModal: false})}
                />

            </div>
        )
    }
}

export default ClientsContainer;