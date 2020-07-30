import React, {Component} from 'react'

class SuccessfulRestore extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="title title_margin">
                    Успешно!
                </div>
                <div className="success">
                    На ваш электронный адрес выслана ссылка для смены пароля.
                </div>
                <div className="back">
                    <a href="/login/">Вернуться</a>
                </div>
            </React.Fragment>
        )
    }
}

export default SuccessfulRestore