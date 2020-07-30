import React, {Component} from 'react'
import API from '../../services/api'
import Loader from "../../controls/Loader";
import EmployeePagination from "../Employees/EmployeePagination";
import ButtonIcon from "../../controls/ButtonIcon";


class DictionaryList extends Component {
    constructor() {
        super()
        this.state = {
            cellParamsArray: [],
            showLoader: false,
            itemsPerPage: 0,
            countPages: 0,
            leftBound: 0,
            rightBound: 0
        }
    }

    componentDidMount() {
        this.setState({
            itemsPerPage: window.itemsPerPage,
            rightBound: window.itemsPerPage
        });

        this.setState({showLoader: true}, () => {
            API.get('getCellParameters')
                .then(result => {
                    let cells = result.data.data;
                    let countPages = Math.ceil(cells.length / this.state.itemsPerPage);
                    this.setState({
                        cellParamsArray: cells,
                        showLoader: false,
                        countPages: countPages
                    })
                })
        })
    }

    resetActivePages = () => {
        let elements = document.getElementsByClassName("pagination-page");
        if (elements.length !== 0) {
            [].forEach.call(elements, function (el) {
                el.classList.remove("active-page");
            });
        }
    }

    updateBounds = (newRightBound, newLeftBound) => {
        this.setState({
            rightBound: newRightBound,
            leftBound: newLeftBound
        })
    }

    render() {
        const dictListSliced = this.state.cellParamsArray.slice(
            this.state.leftBound, this.state.rightBound
        );

        return (
            <div className="content">
                <div className="container">
                    <div className="top top-flex-end">
                        <div className="top__left">
                            <div className="wrap-capton">
                                <div className="caption">
                                    {window.pageHeader}
                                </div>
                            </div>
                            <form>
                                <div className="form__input">
                                    <div className="label-input">
                                        {window.filterText}
                                    </div>
                                    <div className="select">
                                        <select defaultValue="Выбор справочника">
                                            <option>Типоразмеры ячеек</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="top__right">
                            <a href="#" onClick={e => {
                                e.preventDefault();
                                this.props.handler(1)
                            }} className="button">{window.buttonAddText}</a>
                        </div>
                    </div>
                    <div className="table-wrap">
                        <table>
                            <tr>
                                <th>{window.tablePosition}</th>
                                <th>{window.tableName}</th>
                                <th>{window.tableDescription}</th>
                                <th></th>
                            </tr>
                            {dictListSliced.map((cellParam) =>
                                <tr>
                                    <td>№{cellParam.id}</td>
                                    <td>
                                        {cellParam.name}
                                    </td>
                                    <td>
                                        {cellParam.description}
                                    </td>
                                    <td>
                                        <ButtonIcon
                                            className="button-gear"
                                            handleClick={e => {
                                                e.preventDefault();
                                                this.props.handler(2, cellParam)
                                            }}
                                            title="Редактировать"
                                        />
                                    </td>
                                </tr>
                            )}
                        </table>
                    </div>

                    {this.state.countPages === 1 || this.state.countPages === 0
                        ?
                        null
                        :
                        <EmployeePagination
                            handleUpdateBounds={this.updateBounds}
                            handleResetActivePages={this.resetActivePages}
                            countPages={this.state.countPages}
                            itemsPerPage={this.state.itemsPerPage}
                            changePage={this.changePage}
                        />
                    }
                </div>

                <Loader showLoader={this.state.showLoader}/>

            </div>
        )
    }
}

export default DictionaryList