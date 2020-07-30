import React, {Component} from 'react';

function SuccessfulAction(props){
        return(
            <React.Fragment>
                <div className="success">
                    {props.text}
                </div>
                <div className="back">
                    <a href="../..">{props.textOfLink}</a>
                </div>
            </React.Fragment>
        )
}

export default SuccessfulAction