import React, {Component} from 'react';
import ChangePassword from "../../components/Account/ChangePassword";


class ChangePasswordContainer extends Component {
    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="signin">
                        <ChangePassword titleStyles="title"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChangePasswordContainer;