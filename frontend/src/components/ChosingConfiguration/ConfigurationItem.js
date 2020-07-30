import React, {Component} from 'react'


class ConfigurationItem extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <React.Fragment>
                <div className="selectCard">
                    <div className="selectCard__wrapImg">
                        <img src={'../../../static/img/original_images/' + this.props.icon}
                             alt={this.props.icon}/>
                    </div>
                    <div className="selectCard__body">
                        <h2 className="selectCard__head">{this.props.config.name}</h2>
                        <p className="selectCard__text">{this.props.config.description}</p>
                        <button onClick={e => {
                            e.preventDefault();
                            this.props.chooseConfig(this.props.config.id)
                        }} className="selectCard__btn">{window.buttonChooseText}
                        </button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ConfigurationItem;