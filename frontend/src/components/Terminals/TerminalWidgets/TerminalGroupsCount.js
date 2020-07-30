import React, {Component} from 'react'
import {ADMIN_GROUPS} from "../../../ContantUrls";


class TerminalGroupsCount extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="main__col" onClick={e => {
                e.preventDefault();
                window.location = ADMIN_GROUPS;
            }}>
                <a className="main__item" href="">
                    <div className="main__icon">
                        <img src={'../../static/img/original_images/' + this.props.icon}
                             alt={this.props.icon}/>
                    </div>
                    <div className="main__caption">
                        {this.props.text}
                    </div>
                    <div className="main__number">
                        {this.props.count}
                    </div>
                </a>
            </div>
        )
    }
}

export default TerminalGroupsCount