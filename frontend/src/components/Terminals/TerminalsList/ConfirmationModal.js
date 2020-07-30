import React, {Component} from 'react';


class ConfirmationModal extends Component {
    render() {
        let modal = (
            <div className="modal active">
                <div className="modal__container">
                    <div className="modal__block">
                        <div className="modal__caption">
                            <div className="modal__title">{this.props.textTitle}</div>
                        </div>
                        {this.props.closeModal ?
                            <span className="map-data-card__close" onClick={e => {
                                e.preventDefault();
                                this.props.closeModal()
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.23">
                                    <path
                                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                                        fill="black"/>
                                    </g>
                                </svg>
                            </span> : null}
                        <div className="form__submit">
                            <input type="submit" onClick={e => {
                                e.preventDefault();
                                this.props.confirmRequest(this.props.newStatus)
                            }} className="button" value="Да"/>
                            <div className="cansel">
                                <a href="" type="button" onClick={e => {
                                    e.preventDefault();
                                    this.props.rejectRequest()
                                }}>Нет</a>
                            </div>
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

export default ConfirmationModal;