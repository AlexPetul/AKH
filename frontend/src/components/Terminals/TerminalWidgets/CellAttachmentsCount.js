import React, {Component} from 'react'
import {OWNER_ATTACHMENTS} from "../../../ContantUrls";


class CellAttachmentsCount extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="main__col" onClick={e => {
                e.preventDefault();
                window.location = OWNER_ATTACHMENTS;
            }}>
                <a className="main__item" href="">
                    <div className="main__icon">
                        <img src={'/media/original_images/' + this.props.icon}
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

export default CellAttachmentsCount;