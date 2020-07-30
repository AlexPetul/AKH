import React, {Component} from 'react';


class Loader extends Component {
    render() {
        let loader = (
            <div className="loader">
                <div className="loader__container">
                    <div className="loader__item-1"></div>
                    <div className="loader__item-2"></div>
                    <div className="loader__item-3"></div>
                    <div className="loader__item-4"></div>
                    <div className="loader__item-5"></div>
                </div>
            </div>
        )
        if (!this.props.showLoader) {
            loader = null;
        }
        return (
            <React.Fragment>
                {loader}
            </React.Fragment>
        )
    }
}

export default Loader;