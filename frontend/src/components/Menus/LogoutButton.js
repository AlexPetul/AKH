import React from 'react'
import logout from '../Account/Logout'


function Logout() {
    return (
        <React.Fragment>
            <div className="header__logout" style={{display: localStorage.getItem('token') ? 'block' : 'none'}}>
                <a onClick={e => {
                    e.preventDefault();
                    logout()
                }} href="" className="link-power">{window.languageId === 1 ? "Выход" : "Log out"}</a>
            </div>
        </React.Fragment>
    )
}

export default Logout;