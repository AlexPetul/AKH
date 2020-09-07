import React, {Component} from 'react'
import Inputmask from "inputmask";
import Input from "./Input";


class DateMaskedInput extends Component {
    static defaultProps = {
        type: 'text'
    };

    componentDidMount() {
        let selector = document.getElementsByClassName("date-time-mask");
        let im = new Inputmask("99-99-9999 99:99:99");
        for (let index = 0; index < selector.length; index++) {
            im.mask(selector[index]);
        }
    }

    render() {
        return (
            <div className="form__input" id={'wrapper-' + this.props.id}>
                <div className="label-input">
                    {this.props.label}
                </div>
                <input
                    type="text"
                    id={this.props.id}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    name={this.props.name}
                    className="input date-time-mask"
                />
            </div>
        )
    }
}

export default DateMaskedInput;