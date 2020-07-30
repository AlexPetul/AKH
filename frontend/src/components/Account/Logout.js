import API from "../../services/api";
import {LOGIN_PATH} from "../../ContantUrls";


function logout() {
    API.post("logout")
        .then(result => {
            localStorage.clear();
            fetch("/logout/",{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: {}
            })
                .then(response => {
                    window.location = LOGIN_PATH;
                });
        })
}

export default logout