import React, {Component} from 'react'
import MyProfileDetails from "../components/Account/MyProfileDetails";
import ChangePassword from "../components/Account/ChangePassword";


class MyProfileContainer extends Component {
    render() {
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