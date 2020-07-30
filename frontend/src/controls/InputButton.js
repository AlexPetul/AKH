import React, {Component} from 'react'


class InputButton extends Component {
    static defaultProps = {
        type: 'submit'
    }


    render() {
        return (
            <input type="submit" className="button" value={this.props.value}/>
        )
    }
}

export default InputButton