import React, {Component} from 'react'
import Moment from "moment";
import ButtonIcon from "../../../controls/ButtonIcon";


class TerminalTableRow extends Component {
    constructor() {
        super()
    }


    render() {
        return (
            <React.Fragment>
                <tr>
                    <td>{this.props.terminal.number}</td>
                    <td>
                        {this.props.terminal.address}
                        <div className="label">
                        </div>
                    </td>
                    <td>
                        {this.props.terminal.token}
                    </td>
                    {this.props.terminal.expires
                        ?
                        <td>
                            {Moment(this.props.terminal.expires).format('DD.MM.YYYY hh:mm:ss')}
                        </td>
                        :
                        <td></td>
                    }
                    <td>
                        {this.props.statuses.map((status, status_index) =>
                            status.id === this.props.terminal.statusId ?
                                <span key={status_index} className="status"
                                      style={{'color': this.props.colors[this.props.terminal.statusId]}}>{status.name}</span> : null
                        )}
                    </td>
                    {this.props.terminal.statusDateTime ?
                        <td>
                            {Moment(this.props.terminal.statusDateTime).format('DD.MM.YYYY hh:mm:ss')}
                        </td>
                        :
                        <td></td>
                    }
                    <td>
                        <b>{window.pageContent['table_cells_total'][this.props.currentLanguage]} {this.props.terminal.cellsCount}:</b>
                        <ul className="listBlocks">
                            <li className="listBlock__item listBlock__item-current">{window.pageContent['table_cells_free'][this.props.currentLanguage]}
                                - {this.props.terminal.cells[0].count}</li>
                            <li className="listBlock__item listBlock__item-worning ">{window.pageContent['table_cells_busy'][this.props.currentLanguage]}
                                - {this.props.terminal.cells[1].count}</li>
                            <li className="listBlock__item listBlock__item-success">{window.pageContent['table_cells_reserve'][this.props.currentLanguage]}
                                - {this.props.terminal.cells[2].count}</li>
                            <li className="listBlock__item listBlock__item-error">{window.pageContent['table_cells_blocked'][this.props.currentLanguage]}
                                - {this.props.terminal.cells[3].count}</li>
                        </ul>
                    </td>
                    <td>
                        <ButtonIcon
                            title="Информация о терминале"
                            className="button-gear"
                            handleClick={e => {
                                e.preventDefault();
                                this.props.getTerminalInfo(true, this.props.terminal)
                            }}
                        />
                    </td>
                </tr>
            </React.Fragment>
        )
    }
}

export default TerminalTableRow;