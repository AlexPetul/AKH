import React, {Component} from "react";
import Title from "../../controls/Title";
import SuccessfulRestore from "../../components/Account/SuccessfulRestore";
import Restore from "../../components/Account/Restore";


class RestorePasswordContainer extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super();
        this.state = {
            emailSent: false
        };
    }

    changeEmailSent = (emailSent) => {
        this.setState({emailSent: emailSent})
    }

    render() {
        const {changeEmailSent} = this
        return (
            <div className="content">
                <div className="container">
                    <div className="signin">

                        {this.state.emailSent
                            ?
                            <SuccessfulRestore/>
                            :
                            <React.Fragment>
                                <Title titleText={window.pageHeader} titleStyles='title'/>
                                <Restore changeEmailSent={changeEmailSent} />
                            </React.Fragment>
                        }

                    </div>
                </div>
            </div>

        );
    }
}

export default RestorePasswordContainer;