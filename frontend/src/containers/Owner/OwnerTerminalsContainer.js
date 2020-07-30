import React, {Component} from 'react'
import OwnerTerminalsList from "../../components/Terminals/TerminalsList/TerminalsList";
import OwnerTerminalsMap from "../../components/Terminals/TerminalsList/TerminalsMap";
import API from "../../services/api";
import OwnerAddTerminal from "../../components/Terminals/OwnerAddTerminal";
import OwnerTerminalDetailed from "../../components/Terminals/TerminalsList/OwnerTerminalDetailed";
import ModalWindow from "../../components/ModalWindow";


class OwnerTerminalsContainer extends Component {
    constructor() {
        super()
        this.state = {
            containerIndex: 0,
            allowedTerminalStatuses: [],
            isTerminalAdd: false,
            terminalDetailed: false,
            terminalToView: null,
            terminalsList: [],
            showWarningModal: false
        }
    }

    componentDidMount() {
        API.get('getDictionary', {
            params: {
                name: 'terminalStatuses'
            }
        })
            .then(response => {
                let statuses = response.data.data

                this.setState({
                    allowedTerminalStatuses: statuses
                })
            })
    }

    changeTab(containerIndex) {
        this.setState({
            containerIndex: containerIndex
        })
    }

    setInitialTerminalsList = (list) => {
        this.setState({
            terminalsList: list
        })
    }

    filterTerminalsByStatus = (event) => {
        let statusToFilter = event.target.options[event.target.selectedIndex].id;
        let filteredList = [];
        if (statusToFilter === "all") {
            filteredList = this.state.terminalsList
        } else {
            for (let index = 0; index < this.state.terminalsList.length; index++) {
                if (this.state.terminalsList[index].statusId === Number(statusToFilter)) {
                    filteredList.push(this.state.terminalsList[index])
                }
            }
        }

        this.child.updateTerminalsList(filteredList)
    }

    setTerminalDetailed = (state, terminalToView) => {
        this.setState({
            terminalDetailed: state,
            terminalToView: terminalToView
        })
    }

    switchAddTerminalPage() {
        API.get('getCellParameters')
            .then(response => {
                let params = response.data.data;
                if (params.length === 0) {
                    this.setState({showWarningModal: true})
                } else {
                    this.setState({isTerminalAdd: true})
                }
            })
    }

    render() {
        if (this.state.isTerminalAdd) {
            return (
                <React.Fragment>
                    <OwnerAddTerminal/>
                </React.Fragment>
            )
        } else if (this.state.terminalDetailed) {
            return (
                <React.Fragment>
                    <OwnerTerminalDetailed
                        terminal={this.state.terminalToView}
                    />
                </React.Fragment>
            )
        } else {
            return (
                <div className="content">
                    <div className="container">
                        <div className="top">
                            <div className="top__left">
                                <div className="caption">
                                    {window.pageHeader}
                                </div>
                                <div className="description">
                                    {window.pageSubHeader}
                                </div>
                            </div>
                            <div className="top__right">
                                <a href="" onClick={e => {
                                    e.preventDefault();
                                    this.switchAddTerminalPage()
                                }} className="button">{window.addTerminalButton}</a>
                            </div>
                        </div>
                        <div className="top-group-btns">
                            <div className="tabsBtn">
                                <button onClick={e => {
                                    e.stopPropagation();
                                    this.changeTab(0)
                                }}
                                        className={`tabsBtn__btn ${this.state.containerIndex ? "" : "tabsBtn__btn-active"}`}>{window.listTab}
                                </button>
                                <button onClick={e => {
                                    e.stopPropagation();
                                    this.changeTab(1)
                                }}
                                        className={`tabsBtn__btn ${this.state.containerIndex ? "tabsBtn__btn-active" : ""}`}>{window.mapTab}
                                </button>
                            </div>
                            <form>
                                <div className="form__input">
                                    <div className="label-input">
                                        Фильтр
                                    </div>
                                    <div className="select">
                                        <select onChange={this.filterTerminalsByStatus}>
                                            {this.state.allowedTerminalStatuses.map((status, index) =>
                                                (index === 0)
                                                    ?
                                                    <React.Fragment>
                                                        <option id="all" defaultChecked={true} key="all">Все</option>
                                                        <option id={status.id} key={status.id}>{status.name}</option>
                                                    </React.Fragment>
                                                    :
                                                    (status.id !== 305) ?
                                                    <option id={status.id} key={status.id}>{status.name}</option> : null
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <ModalWindow textTitle="Добавьте в справочник хотя бы один типоразмер." value="Ok"
                                     showModal={this.state.showWarningModal}
                                     onClose={(e) => {
                                         this.setState({showWarningModal: false})
                                     }}
                        />

                        {this.state.containerIndex
                            ?
                            <OwnerTerminalsMap
                                setListHandler={this.setInitialTerminalsList}
                                ref={instance => {
                                    this.child = instance;
                                }}
                            />
                            :
                            <OwnerTerminalsList
                                terminalDetailedHandler={this.setTerminalDetailed}
                                setListHandler={this.setInitialTerminalsList}
                                ref={instance => {
                                    this.child = instance;
                                }}
                            />
                        }

                    </div>
                </div>
            )
        }
    }
}

export default OwnerTerminalsContainer