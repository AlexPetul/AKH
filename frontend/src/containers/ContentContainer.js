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


class ContentContainer extends Component {

    componentDidMount() {
        let currentUrl = window.location.pathname
        let currLink = document.querySelectorAll("a[href='" + currentUrl + "']");
        try {
            if (currLink[0].classList[0] !== "link-logo") {
                if (currLink.length !== 0) {
                    let elements = document.getElementsByClassName("nav-link");
                    [].forEach.call(elements, function (el) {
                        el.classList.remove("active");
                    });
                    currLink[0].classList.add('active')
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