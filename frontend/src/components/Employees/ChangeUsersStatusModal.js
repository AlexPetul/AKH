import React, {Component} from 'react'


class ChangeUsersStatusModal extends Component {
    constructor() {
        super()
    }


    render() {
        return (
            <div className="modal active">
                <div className="modal__container">
                    <div className="modal__block">
                        <div className="modal__caption">
                            <div className="modal__title">Вы точно хотите {this.props.nextStatus === 102 ? "заблокировать" :  "разблокировать"} сотрудника?</div>
                        </div>
                        <div className="modal__info">
                            <div className="modal__name">
                                {this.props.user.lastName} {this.props.user.firstName} {this.props.user.surName}
                            </div>
                        </div>
                        <div className="form">
                            <div className="form__submit">
                                <input type="button" onClick={this.props.confirmChangeStatus} className="button" value="Да"/>
                                <div className="cansel">
                                    <a href="" onClick={e => {
                                        e.preventDefault();
                                        this.props.rejectChanging()
                                    }}>Отменить</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChangeUsersStatusModal
