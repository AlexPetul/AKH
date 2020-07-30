import React, {Component} from 'react';
import Title from '../../controls/Title';
import SuccessfulAction from '../../components/Account/SuccessfulAction';
import FormRegistration from "../../components/Account/FormRegistration";


class UserRegistration extends Component {
    constructor() {
        super()
        this.state = {
            isRegistrated: false,
            titleText: "",
            titleStyles: ""
        }
    }

    changeRegistrationStatus = (isRegistrated) => {
        this.setState({isRegistrated})
    }

    render() {
        var {changeRegistrationStatus} = this;
        return (
            <div className="content">
                <div className="container">
                    <div className="signin">
                        {this.state.isRegistrated ?
                            <React.Fragment>
                                <Title titleText='Успешно!' titleStyles='title title_margin'/>
                                <SuccessfulAction
                                    text="Вы зарегистрировались. Пожалуйста проверьте почту и подтвердите регистрацию" textOfLink=""/>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <FormRegistration changeRegistrationStatus={changeRegistrationStatus}/>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default UserRegistration