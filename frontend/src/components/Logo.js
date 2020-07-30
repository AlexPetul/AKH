import React from 'react'


function Logo() {
    return (
        <div className="header__logo">
			<a className="link-logo" href={localStorage.getItem('role_id') === "104" ? "/owner/" : "/administrator/"}>
                <img src="/static/img/logo.png" alt="logo" />
			</a>
		</div>
    )
}

export default Logo