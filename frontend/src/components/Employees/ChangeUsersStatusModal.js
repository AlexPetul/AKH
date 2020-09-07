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
                            {this.props.nextStatus === 102
                                ?
                                <div
                                    className="modal__title">{window.pageContent['modal_block'][this.props.currentLanguage]}</div>
                                :
                                <div
                                    className="modal__title">{window.pageContent['modal_unblock'][this.props.currentLanguage]}</div>
                            }
                        </div>
                        <div className="modal__info">
                            <div className="modal__name">
                                {this.props.user.lastName} {this.props.user.firstName} {this.props.user.surName}
                            </div>
                        </div>
                        <div className="form">
                            <div className="form__submit">
                                <input type="button" onClick={this.props.confirmChangeStatus} className="button"
                                       value={window.pageContent['confirm_delete'][this.props.currentLanguage]}/>
                                <div className="cansel">
                                    <a href="" onClick={e => {
                                        e.preventDefault();
                                        this.props.rejectChanging()
                                    }}>{window.pageContent['reject_delete'][this.props.currentLanguage]}</a>
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
