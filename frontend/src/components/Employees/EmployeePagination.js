import React, {Component} from 'react'


class EmployeePagination extends Component {
    constructor() {
        super()
    }

    nextPage = event => {
        event.preventDefault()

        let elements = document.getElementsByClassName("active-page");
        let rawId = elements[0].id
        let pageNumber = parseInt(rawId.split('-')[2], 10)
        if ((pageNumber + 1) !== this.props.countPages) {
            let newRightBound = this.props.itemsPerPage * (pageNumber + 2)
            let newLeftBound = newRightBound - this.props.itemsPerPage

            this.props.handleUpdateBounds(newRightBound, newLeftBound)
            this.props.handleResetActivePages()

            let nextPageNumber = (pageNumber + 1).toString()
            let activePage = document.getElementById("page-number-" + nextPageNumber)
            activePage.classList.add('active-page')
        }
    }

    prevPage = event => {
        event.preventDefault()

        let elements = document.getElementsByClassName("active-page");
        let rawId = elements[0].id
        let pageNumber = parseInt(rawId.split('-')[2], 10)
        if (pageNumber !== 0) {
            let newRightBound = this.props.itemsPerPage * (pageNumber)
            let newLeftBound = newRightBound - this.props.itemsPerPage

            this.props.handleUpdateBounds(newRightBound, newLeftBound)
            this.props.handleResetActivePages()

            let nextPageNumber = (pageNumber - 1).toString()
            let activePage = document.getElementById("page-number-" + nextPageNumber)
            activePage.classList.add('active-page')
        }
    }

    changePage = event => {
        event.preventDefault()

        let rawPageNumber = event.target.id
        let pageNumber = parseInt(rawPageNumber.split('-')[2], 10)
        let newRightBound = this.props.itemsPerPage * (pageNumber + 1)
        let newLeftBound = newRightBound - this.props.itemsPerPage

        this.props.handleUpdateBounds(newRightBound, newLeftBound)
        this.props.handleResetActivePages()

        let activePage = document.getElementById(rawPageNumber)
        activePage.classList.add('active-page')
    }

    render() {
        return (
            <div className="pagination">
                <a href=""
                   onClick={this.prevPage}
                   className="pagination__prev">{window.languageId === 1 ? "Назад" : "Prev"}</a>
                {Array.from(Array(this.props.countPages)).map((page, page_i) =>
                    <a href=""
                       key={page_i}
                       className={`pagination-page ${page_i ? "" : "active-page"}`}
                       id={"page-number-" + page_i}
                       onClick={this.changePage}
                    >{page_i + 1}</a>
                )}
                <a href=""
                   onClick={this.nextPage}
                   className="pagination__next">{window.languageId === 1 ? "Вперед" : "Next"}</a>
            </div>
        )
    }
}

export default EmployeePagination
