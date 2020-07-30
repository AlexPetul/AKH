import React, {Component} from 'react'
import DictionaryList from "../../components/Dictionary/DictionaryList";
import AddDictionary from "../../components/Dictionary/AddDictionary";
import UpdatePosition from "../../components/Dictionary/UpdatePosition";
import {ValidateState} from "../../helpers/ValidationHelper";


class DictionaryContainer extends Component {
    constructor() {
        super()
        this.state = {
            containerIndex: 0,
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
                <DictionaryList handler={this.handler}/>
            )
        } else if (this.state.containerIndex === 1) {
            return (
                <AddDictionary handler={this.handler}/>
            )
        } else if (this.state.containerIndex === 2) {
            return (
                <UpdatePosition currentPosition={this.state.currentPosition} handler={this.handler}/>
            )
        }
    }
}

export default DictionaryContainer