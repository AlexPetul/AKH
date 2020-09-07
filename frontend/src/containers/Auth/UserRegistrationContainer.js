import React, {Component} from 'react';
import FormRegistration from "../../components/Account/FormRegistration";


class UserRegistration extends Component {
    constructor() {
        super()
        this.state = {
            titleText: "",
            titleStyles: ""
        }
    }

    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="signin">
                        <FormRegistration/>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserRegistration;