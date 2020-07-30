import React, {Component} from 'react'


class Input extends Component {
    static defaultProps = {
        type: 'text'
    };

    maxLengthCheck = (object) => {
        if (object.target.value.length > this.props.maxLength) {
            object.target.value = object.target.value.slice(0, this.props.maxLength)
        }
    };

    render() {
        return (
            <div className="form__input">
                <div className="label-input">
                    {this.props.label}
                </div>
                <input onInput={this.maxLengthCheck} type={this.props.type} className={this.props.className}
                       name={this.props.name}
                       value={this.props.value} onChange={this.props.onChange} id={this.props.id}/>
                {this.props.id === "terminal-address"
                    ?
                    null
                    :
                    <div
                        className="label-error">{!this.props.isValid && this.props.validationMessageLength && this.props.validationMessageText}</div>
                }
            </div>
        )
    }
}

export default Input