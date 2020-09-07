import React, {Component} from 'react'


class IntervalInput extends Component {
    static defaultProps = {
        type: 'text'
    };

    constructor(props) {
        super(props);
        this.state = {
            intervalType: "min",
        }
    }

    componentDidMount() {
        if (this.props.intervalType !== false) {
            let intervalType = this.props.intervalType.split(' ')[1];
            if (intervalType === "мин.") {
                this.setState({intervalType: "min"})
            } else if (intervalType === "ч.") {
                this.setState({intervalType: "hours"});
            } else if (intervalType === "д.") {
                this.setState({intervalType: "days"});
            }
        }
    }

    maxLengthCheck = (object) => {
        if (object.target.value.length > this.props.maxLength) {
            object.target.value = object.target.value.slice(0, this.props.maxLength)
        }
    };

    render() {
        return (
            <div className="form__input interval__input">
                <div className="label-input">
                    {this.props.label}
                </div>
                <input onInput={this.maxLengthCheck}
                       type={this.props.type}
                       className={this.props.className}
                       name={this.props.name}
                       value={this.props.value}
                       onChange={this.props.onChange}
                       id={this.props.id}
                />
                <div className="select interval__wrapper">
                    <select id="interval__type">
                        <option selected={this.state.intervalType === "min"} value="min">мин</option>
                        <option selected={this.state.intervalType === "hours"} value="hours">ч</option>
                        <option selected={this.state.intervalType === "days"} value="days">сутки</option>
                    </select>
                </div>
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

export default IntervalInput;