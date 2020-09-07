import React, {Component} from "react";
import Title from "../../controls/Title";
import Restore from "../../components/Account/Restore";


class RestorePasswordContainer extends Component {
    inputStyle = "input input_weight";

    constructor() {
        super();
        this.state = {
            currentLanguage: localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1
        };
    }

    render() {
        return (
            <div className="content">
                <div className="container">
                    <div className="signin">
                        <Title titleText={window.pageContent['page_header'][this.state.currentLanguage]}
                               titleStyles='title'/>
                        <Restore/>
                    </div>
                </div>
            </div>

        );
    }
}

export default RestorePasswordContainer;