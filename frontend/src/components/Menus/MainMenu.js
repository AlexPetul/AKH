import React from 'react';
import ContextLogout from "../Account/SuperadminLogout";
import DynamicMenu from "./DynamicMenu";
import Logout from "./LogoutButton";


function MainMenu() {
    return (
        <React.Fragment>
            <DynamicMenu/>
            {localStorage.getItem('context_id')
                ?
                <ContextLogout/>
                :
                <Logout/>
            }
        </React.Fragment>
    )
}

export default MainMenu