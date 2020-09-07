import React, {Component} from 'react'
import GuestMenu from "../components/Menus/GuestMenu";
import MainMenu from "../components/Menus/MainMenu";
import {Route} from 'react-router-dom'
import AdminMenu from "../components/Menus/AdminMenu";


class MenuConfigContainer extends Component {
    render() {
        return (
            <React.Fragment>
                <div className={this.props.className}>
                    <Route exact={true} path='/login' component={GuestMenu}/>
                    <Route exact={true} path='/registration' component={GuestMenu}/>
                    <Route exact={true} path='/changepassword/*/*' component={GuestMenu}/>
                    <Route exact={true} path='/forgotpassword' component={GuestMenu}/>

                    <Route exact={true} path='/owner' component={MainMenu}/>
                    <Route exact={true} path='/owner/configuration' component={MainMenu}/>
                    <Route exact={true} path='/owner/terminals' component={MainMenu}/>
                    <Route exact={true} path='/owner/profile' component={MainMenu}/>
                    <Route exact={true} path='/owner/dictionaries' component={MainMenu}/>
                    <Route exact={true} path='/owner/employees' component={MainMenu}/>
                    <Route exact={true} path='/owner/clients' component={MainMenu}/>
                    <Route exact={true} path='/owner/receivers' component={MainMenu}/>
                    <Route exact={true} path='/owner/accesses' component={MainMenu}/>
                    <Route exact={true} path='/owner/payments' component={MainMenu}/>
                    <Route exact={true} path='/owner/collections' component={MainMenu}/>
                    <Route exact={true} path='/owner/storages' component={MainMenu}/>
                    <Route exact={true} path='/owner/stowage' component={MainMenu}/>
                    <Route exact={true} path='/owner/tariffs' component={MainMenu}/>

                    <Route exact={true} path='/administrator' component={AdminMenu}/>
                    <Route exact={true} path='/administrator/profile' component={AdminMenu}/>
                    <Route exact={true} path='/administrator/employees' component={AdminMenu}/>
                    <Route exact={true} path='/administrator/terminalgroups' component={AdminMenu}/>
                    <Route exact={true} path='/administrator/terminals' component={AdminMenu}/>
                </div>
            </React.Fragment>
        )
    }
}

export default MenuConfigContainer