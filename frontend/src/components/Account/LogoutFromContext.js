import {ADMIN_GROUPS} from "../../ContantUrls";


function logoutFromSuperAdmin() {
    localStorage.removeItem('context_id');
    fetch('/delete-context/', {
        method: 'POST',
        body: {},
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {
            if (window.location.pathname.startsWith("/owner/")) {
                window.location = ADMIN_GROUPS;
            }
        });
}

export default logoutFromSuperAdmin;