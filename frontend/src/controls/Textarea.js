import React, {Component} from 'react'


class Textarea extends Component {
    static defaultProps = {
        type: 'text'
    }

    render() {
        return (
            <div className="form__input">
                <div className="label-input">
                    {this.props.label}
                </div>
                <textarea style={{'resize': 'none'}} className={this.props.className} name={this.props.name} cols={this.props.cols} rows={this.props.rows}
                       value={this.props.value} onChange={this.props.onChange} id={this.props.id}/>
                <div
                    className="label-error">{!this.props.isValid && this.props.validationMessageLength && this.props.validationMessageText}</div>
            </div>
        )
    }
}

export default Textarea