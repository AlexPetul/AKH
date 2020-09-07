import React, {Component} from 'react'
import DictionaryList from "../../components/Dictionary/DictionaryList";
import AddDictionary from "../../components/Dictionary/AddDictionary";
import UpdatePosition from "../../components/Dictionary/UpdatePosition";
import {ValidateState} from "../../helpers/ValidationHelper";


class DictionaryContainer extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            containerIndex: 0,
            currentLanguage: currentLanguage,
            currentPosition: {}
        };

        this.handler = this.handler.bind(this)
    }

    handler(containerIndex, currItem) {
        this.setState({
            containerIndex: containerIndex,
            currentPosition: currItem
        })
    }

    render() {
        if (this.state.containerIndex === 0) {
            return (
                <DictionaryList
                    currentLanguage={this.state.currentLanguage}
                    handler={this.handler}/>
            )
        } else if (this.state.containerIndex === 1) {
            return (
                <AddDictionary
                    currentLanguage={this.state.currentLanguage}
                    handler={this.handler}/>
            )
        } else if (this.state.containerIndex === 2) {
            return (
                <UpdatePosition
                    currentLanguage={this.state.currentLanguage}
                    currentPosition={this.state.currentPosition}
                    handler={this.handler}/>
            )
        }
    }
}

export default DictionaryContainer