import React, {Component} from 'react'
import API from "../../services/api";
import EmployeePagination from "../Employees/EmployeePagination";
import ModalWindow from "../ModalWindow";
import Loader from "../../controls/Loader";
import ButtonIcon from "../../controls/ButtonIcon";
import ConfirmationModal from "../Terminals/TerminalsList/ConfirmationModal";
import Button from "../../controls/Button";


class CollectionsList extends Component {
    constructor(props) {
        super(props)
        let currentLanguage = localStorage.getItem('lang_id') ? localStorage.getItem('lang_id') : 1;
        this.state = {
            showLoader: false,
            currentLanguage: currentLanguage,
            collections: [],
            errorModal: false,
            recalcModal: false,
            collectionId: undefined,
            itemsPerPage: 0,
            countPages: 0,
            leftBound: 0,
            rightBound: 0,
        }
    }

    componentDidMount() {
        this.setState({
            itemsPerPage: window.itemsPerPage,
            rightBound: window.itemsPerPage
        });
    }

    updateBounds = (newRightBound, newLeftBound) => {
        this.setState({
            rightBound: newRightBound,
            leftBound: newLeftBound
        })
    };

    resetActivePages = () => {
        let elements = document.getElementsByClassName("pagination-page");
        if (elements.length !== 0) {
            [].forEach.call(elements, function (el) {
                el.classList.remove("active-page");
            });
        }
    };

    getCollections = (terminalId, dateStart, dateEnd) => {
        this.setState({showLoader: true}, () => {
            API.get('getCollections',
                {
                    params: {
                        terminalId: Number(terminalId),
                        dateTimeForm: dateStart,
                        dateTimeTo: dateEnd
                    }
                })
                .then(response => {
                    if (response.data.errorCode === 5 || response.data.errorCode === 1) {
                        this.setState({
                            errorModal: true,
                            showLoader: false
                        });
                    } else {
                        let collections = response.data.data.list;
                        let countPages = Math.ceil(collections.length / this.state.itemsPerPage);
                        this.setState({
                            showLoader: false,
                            collections: collections,
                            countPages: countPages
                        });
                    }
                })
                .catch(error => {
                    this.setState({showLoader: false, errorModal: true});
                    console.log('error', error);
                });
        });
    };

    openRecalcModal = (collectionId) => {
        this.setState({
            recalcModal: true,
            collectionId: collectionId
        });
    };

    rejectRecalcRequest = () => {
        this.setState({recalcModal: false});
    };

    confirmRequest = () => {
        this.setState({showLoader: true, recalcModal: false}, () => {
            API.get('calculateCollection', {
                params: {
                    id: this.state.collectionId
                }
            })
                .then(response => {
                    let result = response.data.data;
                    let row = document.querySelectorAll("tr[id='" + this.state.collectionId + "']")[0];
                    let newRow = document.createElement('tr');
                    newRow.id = this.state.collectionId;
                    newRow.classList.add(result.paymentsSum !== result.sum ? "collection__invalid" : "coll_valid");

                    let collectExtId = document.createElement('td');
                    collectExtId.innerHTML = result.collectExtId;
                    newRow.append(collectExtId);
                    let paymentsCount = document.createElement('td');
                    paymentsCount.innerHTML = result.paymentsCount;
                    newRow.append(paymentsCount);
                    let paymentsSum = document.createElement('td');
                    paymentsSum.innerHTML = result.paymentsSum;
                    newRow.append(paymentsSum);
                    let billsCount = document.createElement('td');
                    billsCount.innerHTML = result.billsCount;
                    newRow.append(billsCount);
                    let billsSum = document.createElement('td');
                    billsSum.innerHTML = result.billsSum;
                    newRow.append(billsSum);
                    let coinsCount = document.createElement('td');
                    coinsCount.innerHTML = result.coinsCount;
                    newRow.append(coinsCount);
                    let coinsSum = document.createElement('td');
                    coinsSum.innerHTML = result.coinsSum;
                    newRow.append(coinsSum);
                    let sum = document.createElement('td');
                    sum.innerHTML = result.sum;
                    newRow.append(sum);

                    let bills = document.createElement('td');
                    bills.classList.add('bills__count');
                    for (let index = 0; index < result.bills.length; index++) {
                        let billList = document.createElement('ul');
                        billList.classList.add('listBlocks');
                        let nominal = document.createElement('li');
                        nominal.innerHTML = `Номинал: ${result.bills[index].nominal}`;
                        nominal.classList.add('listBlock__item');
                        nominal.classList.add('listBlock__item-current');
                        let count = document.createElement('li');
                        count.innerHTML = `Кол-во: ${result.bills[index].count}`;
                        count.classList.add('listBlock__item');
                        count.classList.add('listBlock__item-current');
                        billList.append(nominal, count);
                        bills.append(billList);
                    }
                    newRow.append(bills);

                    let coins = document.createElement('td');
                    coins.classList.add('bills__count');
                    for (let index = 0; index < result.coins.length; index++) {
                        let coinsList = document.createElement('ul');
                        coinsList.classList.add('listBlocks');
                        let nominal = document.createElement('li');
                        nominal.innerHTML = `Номинал: ${result.coins[index].nominal}`;
                        nominal.classList.add('listBlock__item');
                        nominal.classList.add('listBlock__item-current');
                        let count = document.createElement('li');
                        count.innerHTML = `Кол-во: ${result.coins[index].count}`;
                        count.classList.add('listBlock__item');
                        count.classList.add('listBlock__item-current');
                        coinsList.append(nominal, count);
                        coins.append(coinsList);
                    }
                    newRow.append(coins);
                    let gear = document.getElementsByClassName('gear_collection__' + result.id)[0];
                    newRow.append(gear);
                    row.replaceWith(newRow);
                    this.setState({recalcModal: false, showLoader: false});
                });
        });
    };

    render() {
        let collectionListSliced = this.state.collections.slice(
            this.state.leftBound, this.state.rightBound
        );

        if (collectionListSliced.length === 0) {
            collectionListSliced = this.state.collections.slice(0, 7)
        }

        return (
            <React.Fragment>
                <div className="table-wrap">
                    <table className="collections_table">
                        <tbody>
                        <tr className="collections_table__header">
                            <th>{window.pageContent['table_number'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_count_payments'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_sum_payments'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_bills_count'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_sum_bills'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_coins_count'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_coins_sum'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_collections_sum'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_bills'][this.state.currentLanguage]}</th>
                            <th>{window.pageContent['table_coins'][this.state.currentLanguage]}</th>
                            <th></th>
                        </tr>

                        {collectionListSliced.map((collectionItem, index) =>
                            <tr id={collectionItem.id} className={collectionItem.paymentsSum !== collectionItem.sum ? "collection__invalid" : ""}
                                key={index}>
                                <td>{collectionItem.collectExtId}</td>
                                <td>{collectionItem.paymentsCount}</td>
                                <td>{collectionItem.paymentsSum}</td>
                                <td>{collectionItem.billsCount}</td>
                                <td>{collectionItem.billsSum}</td>
                                <td>{collectionItem.coinsCount}</td>
                                <td>{collectionItem.coinsSum}</td>
                                <td>{collectionItem.sum}</td>
                                <td className="bills__count">
                                    {collectionItem.bills.map((bill) =>
                                        <ul className="listBlocks">
                                            <li className="listBlock__item listBlock__item-current">Номинал: {bill.nominal}</li>
                                            <li className="listBlock__item listBlock__item-current">Кол-во: {bill.count}</li>
                                        </ul>
                                    )}
                                </td>
                                <td className="bills__count">
                                    {collectionItem.coins.map((bill) =>
                                        <ul className="listBlocks">
                                            <li className="listBlock__item listBlock__item-current">Номинал: {bill.nominal}</li>
                                            <li className="listBlock__item listBlock__item-current">Кол-во: {bill.count}</li>
                                        </ul>
                                    )}
                                </td>
                                <td className={'gear_collection__' + collectionItem.id}>
                                    <ButtonIcon
                                        className={collectionItem.paymentsSum !== collectionItem.sum ? "button-gear gear__invalid" : "button-gear"}
                                        handleClick={e => {
                                            e.preventDefault();
                                            this.openRecalcModal(collectionItem.id)
                                        }}
                                    />
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    {this.state.countPages > 1
                        ?
                        <EmployeePagination
                            handleUpdateBounds={this.updateBounds}
                            handleResetActivePages={this.resetActivePages}
                            countPages={this.state.countPages}
                            itemsPerPage={this.state.itemsPerPage}
                            changePage={this.changePage}
                        />
                        :
                        null
                    }

                </div>

                <ModalWindow
                    textTitle="Пожалуйста проверьте правильность введенных данных."
                    value="Ok"
                    showModal={this.state.errorModal}
                    onClose={(e) => this.setState({errorModal: false})}
                />

                <ConfirmationModal
                    textTitle="Вы действительно хотите пересчитать данные инкассации?"
                    showModal={this.state.recalcModal}
                    rejectRequest={this.rejectRecalcRequest}
                    confirmRequest={this.confirmRequest}
                    newStatus=""
                />

                <Loader showLoader={this.state.showLoader}/>

            </React.Fragment>
        )
    }
}

export default CollectionsList;