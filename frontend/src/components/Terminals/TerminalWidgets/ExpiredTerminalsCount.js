import React, {Component} from 'react'
import {ADMIN_TERMINALS, OWNER_TERMINALS} from "../../../ContantUrls";


class ExpiredTerminalsCount extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="main__col" onClick={e => {
                e.preventDefault();
                if (localStorage.getItem('role_id') === '104' || localStorage.getItem('context_id')) {
                    window.location = OWNER_TERMINALS;
                } else {
                    window.location = ADMIN_TERMINALS;
                }
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

export default ExpiredTerminalsCount