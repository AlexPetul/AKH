import React from 'react'
import DynamicMenu from "./DynamicMenu";
import Logout from "./LogoutButton";


function GuestMenu() {
    return (
        <React.Fragment>
            <DynamicMenu/>
            <Logout/>
        </React.Fragment>
    )
}

export default GuestMenu