import React from 'react'
import logoutFromSuperAdmin from "./LogoutFromContext";


function ContextLogout() {
    return (
        <div className="header__logout">
            <a onClick={e => {
                e.preventDefault();
                logoutFromSuperAdmin()
            }} href="" className="nav-link link-power">
                {window.languageId === 1 ? "Выход из кабинета" : "Exit from cabinet"}
            </a>
        </div>
    )
}

export default ContextLogout;