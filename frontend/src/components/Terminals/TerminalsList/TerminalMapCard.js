import React, {Component} from 'react'
import Moment from "moment";
import API from "../../../services/api";


class TerminalMapCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            terminalStatuses: [],
            statusColors: window.statusColors
        }
    }

    componentDidMount() {
        API.get('getDictionary', {
            params: {
                name: 'terminalStatuses'
            }
        })
            .then(response => {
                let statuses = response.data.data;
                this.setState({
                    terminalStatuses: statuses
                })
            })
    }

    render() {
        return (
            <React.Fragment>
                <div className="owner-terminals-map owner-terminals-map-position">
                    <div className="map-data-card map-data-card-position">
						<span className="map-data-card__close" onClick={this.props.closeTab}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
								<g opacity="0.23">
								<path
                                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                                    fill="black"/>
								</g>
							</svg>
						</span>
                        <div className="map-data-card__head">
                            {window.languageId === 1 ? "Терминал" : "Terminal"} №{this.props.terminal.id}
                            {this.state.terminalStatuses.map((status) =>
                                status.id === this.props.terminal.statusId ?
                                    <span
                                        style={{'color': this.state.statusColors[this.props.terminal.statusId]}}>{status.name}</span> : null
                            )}
                        </div>
                        <ul className="map-data-card__list">
                            <li>
                                <b className="map-data-card__text">{this.props.terminal.address}</b>
                                {/*<span className="map-data-card__subtext">Казань, Россия</span>*/}
                            </li>
                            <li>
                                <span className="map-data-card__subtext">{window.pageContent['card_token'][this.props.currentLanguage]}:</span>
                                <b className="map-data-card__text">{this.props.terminal.token}</b>
                            </li>
                            <li>
                                <span className="map-data-card__subtext">{window.pageContent['card_token_expires'][this.props.currentLanguage]}:</span>
                                {this.props.terminal.expires
                                    ?
                                    <b className="map-data-card__text">{Moment(this.props.terminal.expires).format('DD.MM.YYYY hh:mm:ss')}</b>
                                    :
                                    null
                                }
                            </li>
                            <li>
                                <span className="map-data-card__subtext">{window.pageContent['card_status_date'][this.props.currentLanguage]}:</span>
                                <b className="map-data-card__text">{Moment(this.props.terminal.statusDateTime).format('DD.MM.YYYY hh:mm:ss')}</b>
                            </li>
                        </ul>
                        <div className="wrap-listBlocks">
                            <span className="map-data-card__subtext">{window.pageContent['table_cells_count'][this.props.currentLanguage]}:</span>
                            <b>{window.pageContent['table_cells_total'][this.props.currentLanguage]} {this.props.terminal.cellsCount}:</b>
                            <ul className="listBlocks listBlocks-flex-row">
                                <il className="listBlock__item listBlock__item-current">{window.pageContent['table_cells_free'][this.props.currentLanguage]}
                                    - {this.props.terminal.cells[0].count}</il>
                                <il className="listBlock__item listBlock__item-worning ">{window.pageContent['table_cells_busy'][this.props.currentLanguage]}
                                    - {this.props.terminal.cells[1].count}</il>
                                <il className="listBlock__item listBlock__item-success">{window.pageContent['table_cells_reserve'][this.props.currentLanguage]}
                                    - {this.props.terminal.cells[2].count}</il>
                                <il className="listBlock__item listBlock__item-error">{window.pageContent['table_cells_blocked'][this.props.currentLanguage]}
                                    - {this.props.terminal.cells[3].count}</il>
                            </ul>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default TerminalMapCard