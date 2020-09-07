import React, {Component} from 'react';
import Button from "../controls/Button";


class ModalWindow extends Component {
    render() {
        let modal = (
            <div className="modal active">
                <div className="modal__container">
                    <div className="modal__block">
                        <div className="modal__caption">
                            <div className="modal__title">{this.props.textTitle}</div>
                        </div>
                        <div className="form__submit">
                            <input type="submit" onClick={e => {
                                e.preventDefault();
                                this.props.onClose()
                            }} className="button" value={this.props.value}/>
                            {this.props.sendAgainMail
                                ?
                                <div className="cansel">
                                    <a href="" type="button" onClick={e => {
                                        e.preventDefault();
                                        this.props.sendAgainMail()
                                    }}>{window.pageContent['modal_send_again'][this.props.currentLanguage]}</a>
                                </div>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
        if (!this.props.showModal) {
            modal = null;
        }
        return (
            <React.Fragment>
                {modal}
            </React.Fragment>

        )
    }
}

export default ModalWindow;