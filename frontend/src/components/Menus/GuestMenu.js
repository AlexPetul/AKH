import React from 'react'
import logout from '../Account/Logout'
import {LOGIN_PATH, REGISTRATION_PATH} from "../../ContantUrls";
import changeLanguage from "../../services/changeLanguage";


function GuestMenu() {
    return (
        <React.Fragment>
            <div className="header__nav">
                <ul>
                    <li><a href='/login/' className="link-auth">Вход на
                        сайт</a></li>
                    <li><a href='/registration/'
                           className="link-registration">Регистрация</a></li>
                    <li>
                        <a className={`nav-link lang-select ${window.languageId === 1 ? 'lang-rus' : 'lang-eng'}`} href="" onClick={e => {
                            e.preventDefault();
                        }}>
                            <select defaultValue={window.languageId} onChange={changeLanguage}>
                                <option key={1} value="1">Русский</option>
                                <option key={2} value="2">English</option>
                            </select>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="header__logout" style={{display: localStorage.getItem('token') ? 'block' : 'none'}}>
                <a onClick={e => {
                    e.preventDefault();
                    logout()
                }} href="" className="link-power">Выход</a>
            </div>
        </React.Fragment>
    )
}

export default GuestMenu