import React, {Component} from 'react'
import MyProfileDetails from "../components/Account/MyProfileDetails";
import ChangePassword from "../components/Account/ChangePassword";
import logoutFromSuperAdmin from "../components/Account/LogoutFromContext";


class MyProfileContainer extends Component {
    render() {
        if (localStorage.getItem('context_id')) {
            logoutFromSuperAdmin();
        }

        return (
            <div className="content content_myprofile">
                <div className="container">
                    <MyProfileDetails titleStyles="caption"/>
                    <ChangePassword titleStyles="caption caption_change-password"/>
                </div>
            </div>
        )
    }
}

export default MyProfileContainer