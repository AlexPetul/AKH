import React from 'react';
import logout from '../Account/Logout';
import changeLanguage from "../../services/changeLanguage";
import {
    OWNER_MAIN,
    OWNER_PROFILE,
    OWNER_TERMINALS,
    OWNER_DICTIONARIES,
    OWNER_EMPLOYEES,
    ADMIN_GROUPS
} from "../../ContantUrls";


function logout_from_superadmin() {
    localStorage.removeItem('context_id');
    fetch('/delete-context/', {
        method: 'POST',
        body: {},
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {
            window.location = ADMIN_GROUPS;
        });
}

function MainMenu() {
    return (
        <React.Fragment>
            <div className="header__nav">
                <ul>
                    <li><a href={OWNER_MAIN} className="nav-link link-main active">Главная</a></li>
                    <li><a href={OWNER_PROFILE} className="nav-link link-profile">Профиль</a></li>
                    <li><a href={OWNER_TERMINALS} className="nav-link link-terminals">Терминалы</a></li>
                    <li><a href={OWNER_EMPLOYEES} className="nav-link link-employees">Сотрудники</a></li>
                    <li><a href={OWNER_DICTIONARIES} className="nav-link link-directory">Справочники</a></li>
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
            <div className="header__logout">
                {localStorage.getItem('context_id')
                    ?
                    <a onClick={e => {
                        e.preventDefault();
                        logout_from_superadmin()
                    }} href="" className="nav-link link-power">Выход из кабинета</a>
                    :
                    <a onClick={e => {
                        e.preventDefault();
                        logout()
                    }} href="" className="nav-link link-power">Выход</a>
                }
            </div>
        </React.Fragment>
    )
}

export default MainMenu