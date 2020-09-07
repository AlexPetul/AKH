import React, {Component} from 'react'
import Loader from "../../controls/Loader";
import API from "../../services/api";
import Moment from "moment";
import ButtonIcon from "../../controls/ButtonIcon";
import EmployeePagination from "../Employees/EmployeePagination";
import ConfirmationModal from "../Terminals/TerminalsList/ConfirmationModal";
import ModalWindow from "../ModalWindow";


class AttachmentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            tariffsAttachments: [],
            errorModal: false,
            successDelete: false,
            deleteModal: false,
            attachmentId: 0,
            itemsPerPage: 0,
            countPages: 0,
            leftBound: 0,
            rightBound: 0,
        }
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

    componentDidMount() {
        this.setState({
            itemsPerPage: window.itemsPerPage,
            rightBound: window.itemsPerPage
        });

        this.setState({showLoader: true}, () => {
            API.get('getTariffAttachments')
                .then(response => {
                    let tariffsAttachments = response.data.data.list;
                    let countPages = Math.ceil(tariffsAttachments.length / this.state.itemsPerPage);
                    this.setState({
                        tariffsAttachments: tariffsAttachments,
                        showLoader: false,
                        countPages: countPages
                    })
                })
        });
    };

    openDeleteModal = (attachmentId) => {
        this.setState({attachmentId: attachmentId, deleteModal: true});
    };

    rejectDeleteRequest = () => {
        this.setState({deleteModal: false});
    };

    confirmRequest = () => {
        API.post('deleteTariffAttachment', {
            id: this.state.attachmentId
        })
            .then(response => {
                this.setState({deleteModal: false, successDelete: true});
            });
    };

    render() {
        let attachmentsListSliced = this.state.tariffsAttachments.slice(
            this.state.leftBound, this.state.rightBound
        );

        if (attachmentsListSliced.length === 0) {
            attachmentsListSliced = this.state.tariffsAttachments.slice(0, 7)
        }

        return (
            <React.Fragment>
                <div className="table-wrap">
                    <table>
                        <tbody>
                        <tr>
                            <th>{window.pageContent['table_tariff_name'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_terminal_number'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_cell'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_position'][this.props.currentLanguage]}</th>
                            <th>{window.pageContent['table_datetime'][this.props.currentLanguage]}</th>
                            <th></th>
                        </tr>

                        {attachmentsListSliced.map((attachment, index) =>
                            <tr key={index}>
                                <td>{attachment.tariffName}</td>
                                <td>{attachment.terminalNumber}</td>
                                <td>{attachment.cellParameterName}</td>
                                <td>{attachment.position}</td>
                                <td>{Moment(attachment.startDateTime).format('DD.MM.YYYY hh:mm:ss')}</td>
                                <td>
                                    <div className="buttons">
                                        <ButtonIcon
                                            className="button-delete"
                                            handleClick={e => {
                                                e.preventDefault();
                                                this.openDeleteModal(attachment.id);
                                            }}
                                            title="Удалить"
                                        />
                                        <ButtonIcon
                                            className="button-gear"
                                            handleClick={e => {
                                                e.preventDefault();
                                                this.props.changeContainerIndex(5, {}, attachment);
                                            }}
                                            title="Редактировать"
                                        />
                                    </div>
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

                {this.state.deleteModal
                    ?
                    <ConfirmationModal
                        textTitle={window.pageContent['modal_delete_attachment'][this.props.currentLanguage]}
                        showModal={this.state.deleteModal}
                        rejectRequest={this.rejectDeleteRequest}
                        confirmRequest={this.confirmRequest}
                        newStatus=""
                    />
                    :
                    null
                }

                <ModalWindow
                    textTitle={window.pageContent['modal_delete_attachment_success'][this.props.currentLanguage]}
                    value="Ok"
                    showModal={this.state.successDelete}
                    onClose={(e) => {
                        this.setState({successDelete: false});
                        this.componentDidMount();
                    }
                    }
                />

                <Loader showLoader={this.state.showLoader}/>

            </React.Fragment>
        )
    }
}

export default AttachmentsList;