import React, {Component} from 'react'
import OwnerTerminalsList from "../../components/Terminals/TerminalsList/TerminalsList";
import OwnerTerminalsMap from "../../components/Terminals/TerminalsList/TerminalsMap";
import API from "../../services/api";
import OwnerAddTerminal from "../../components/Terminals/OwnerAddTerminal";
import OwnerTerminalDetailed from "../../components/Terminals/TerminalsList/OwnerTerminalDetailed";
import ModalWindow from "../../components/ModalWindow";
import Title from "../../controls/Title";
import ButtonTopRight from "../../controls/ButtonTopRight";
import Tab from "../../controls/Tab";
import TerminalsFilter from "../../components/Terminals/TerminalsList/TerminalsFilter";
import FilterTitle from "../../controls/FilterTitle";


class OwnerTerminalsContainer extends Component {
    constructor() {
        super()
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            containerIndex: 0,
            currentLanguage: currentLanguage,
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

    changeTab = (containerIndex) => {
        this.setState({
            containerIndex: containerIndex
        })
    };

    setInitialTerminalsList = (list) => {
        this.setState({
            terminalsList: list
        })
    };

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
    };

    setTerminalDetailed = (state, terminalToView) => {
        this.setState({
            terminalDetailed: state,
            terminalToView: terminalToView
        })
    };

    switchAddTerminalPage = () => {
        API.get('getCellParameters')
            .then(response => {
                let params = response.data.data;
                if (params.length === 0) {
                    this.setState({showWarningModal: true})
                } else {
                    this.setState({isTerminalAdd: true})
                }
            })
    };

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
                        currentLanguage={this.state.currentLanguage}
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
                                <Title titleText={window.pageContent['page_header'][this.state.currentLanguage]} titleStyles='caption'/>
                                <Title titleText={window.pageContent['page_subheader'][this.state.currentLanguage]} titleStyles='description'/>
                            </div>

                            <ButtonTopRight
                                handleClick={this.switchAddTerminalPage}
                                buttonText={window.pageContent['add_terminal_button'][this.state.currentLanguage]}
                            />

                        </div>
                        <div className="top-group-btns">
                            <div className="tabsBtn">
                                <Tab
                                    handleClick={this.changeTab}
                                    index={0}
                                    containerIndex={this.state.containerIndex}
                                    tabText={window.pageContent['list_tab'][this.state.currentLanguage]}
                                    className={`tabsBtn__btn ${this.state.containerIndex ? "" : "tabsBtn__btn-active"}`}
                                />
                                <Tab
                                    handleClick={this.changeTab}
                                    index={1}
                                    containerIndex={this.state.containerIndex}
                                    tabText={window.pageContent['map_tab'][this.state.currentLanguage]}
                                    className={`tabsBtn__btn ${this.state.containerIndex ? "tabsBtn__btn-active" : ""}`}
                                />
                            </div>
                            <form>
                                <div className="form__input">
                                    <FilterTitle titleText={window.pageContent['filter_text'][this.state.currentLanguage]}/>
                                    <TerminalsFilter
                                        handleChange={this.filterTerminalsByStatus}
                                        statuses={this.state.allowedTerminalStatuses}
                                        filterAllText={window.pageContent['filter_text_all'][this.state.currentLanguage]}
                                    />
                                </div>
                            </form>
                        </div>

                        <ModalWindow
                            textTitle={window.pageContent['modal_cell_params_empty'][this.state.currentLanguage]}
                            value="Ok"
                            showModal={this.state.showWarningModal}
                            onClose={(e) => {
                                this.setState({showWarningModal: false})
                            }}
                        />

                        {this.state.containerIndex
                            ?
                            <OwnerTerminalsMap
                                currentLanguage={this.state.currentLanguage}
                                setListHandler={this.setInitialTerminalsList}
                                ref={instance => {
                                    this.child = instance;
                                }}
                            />
                            :
                            <OwnerTerminalsList
                                currentLanguage={this.state.currentLanguage}
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