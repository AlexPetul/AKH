import React, {Component} from 'react'
import LogInContainer from "./Auth/LoginContainer";
import ChoosingConfigurationContainer from "./Owner/ChoosingConfigurationContainer"
import UserRegistrationContainer from './Auth/UserRegistrationContainer'
import RestorePassword from "./Auth/RestorePasswordContainer"
import ChangePasswordContainer from "./Auth/ChangePasswordContainer";
import CommonContainer from './Owner/MainForOwnerContainer'
import OwnerTerminalsContainer from "./Owner/OwnerTerminalsContainer";
import MainAdminContainer from "./Admin/MainAdminContainer"
import {Route} from 'react-router-dom'
import DictionaryContainer from "./Owner/DictionaryContainer";
import MyProfileContainer from "./MyProfileContainer";
import OwnerEmployeesContainer from "./Owner/OwnerEmployeesContainer";
import TerminalGroupsContainer from "./Admin/TerminalGroupsContainer";
import AdminTerminalsContainer from "./Admin/AdminTerminalsContainer";
import PaymentsContainer from "./Owner/PaymentsContainer";
import CollectionsContainer from "./Owner/CollectionsContainer";
import StoragesContainer from "./Owner/StoragesContainer";
import ClientsContainer from "./Owner/ClientsContainer";
import OwnerAccessesContainer from "./Owner/OwnerAccessesContainer";
import TariffsContainer from "./Owner/TariffsContainer";


class ContentContainer extends Component {

    componentDidMount() {
        let currentUrl = window.location.pathname;
        let currLinkRaw = document.querySelectorAll("a[href='" + currentUrl + "']");
        let currLink = [];
        for (let index = 0; index < currLinkRaw.length; index++) {
            if (currLinkRaw[index].classList.contains('nav-link')) {
                currLink.push(currLinkRaw[index]);
            }
        }

        try {
            if (currLink[0].classList[0] !== "link-logo") {
                if (currLink.length !== 0) {
                    let elements = document.getElementsByClassName("nav-link");
                    [].forEach.call(elements, function (el) {
                        el.classList.remove("active");
                    });
                    currLink[0].classList.add('active');
                    let index = currLink[0].getAttribute('index');
                    document.getElementById('ic_id__' + index).style.display = 'none';
                    document.getElementById('ic_hover_id__' + index).style.display = 'inline-block';
                }
            }
        } catch (e) {
        }
    }

    render() {
        return (
            <React.Fragment>

                <Route exact={true} path='/owner' component={CommonContainer}/>
                <Route exact={true} path='/owner/configuration' component={ChoosingConfigurationContainer}/>
                <Route exact={true} path='/owner/terminals' component={OwnerTerminalsContainer}/>
                <Route exact={true} path='/owner/profile' component={MyProfileContainer}/>
                <Route exact={true} path='/owner/dictionaries' component={DictionaryContainer}/>
                <Route exact={true} path='/owner/employees' component={OwnerEmployeesContainer}/>
                <Route exact={true} path='/owner/clients' component={ClientsContainer}/>
                <Route exact={true} path='/owner/receivers' component={ClientsContainer}/>
                <Route exact={true} path='/owner/payments' component={PaymentsContainer}/>
                <Route exact={true} path='/owner/accesses' component={OwnerAccessesContainer}/>
                <Route exact={true} path='/owner/collections' component={CollectionsContainer}/>
                <Route exact={true} path='/owner/storages' component={StoragesContainer}/>
                <Route exact={true} path='/owner/stowage' component={StoragesContainer}/>
                <Route exact={true} path='/owner/tariffs' component={TariffsContainer}/>


                <Route exact={true} path='/administrator' component={MainAdminContainer}/>
                <Route exact={true} path='/administrator/profile' component={MyProfileContainer}/>
                <Route exact={true} path='/administrator/terminalgroups' component={TerminalGroupsContainer}/>
                <Route exact={true} path='/administrator/terminals' component={AdminTerminalsContainer}/>
                <Route exact={true} path='/administrator/employees' component={OwnerEmployeesContainer}/>


                <Route exact={true} path='/forgotpassword' component={RestorePassword}/>
                <Route exact={true} path='/changepassword/*/*' component={ChangePasswordContainer}/>
                <Route exact={true} path='/login' component={LogInContainer}/>
                <Route exact={true} path='/registration' component={UserRegistrationContainer}/>
            </React.Fragment>
        )
    }
}

export default ContentContainer