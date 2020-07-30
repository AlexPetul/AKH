import React from 'react'
import logout from '../Account/Logout'
import {ADMIN_MAIN, ADMIN_EMPLOYEES, ADMIN_GROUPS, ADMIN_PROFILE, ADMIN_TERMINALS} from "../../ContantUrls";
import changeLanguage from "../../services/changeLanguage";


function AdminMenu() {
    return (
        <React.Fragment>
            <div className="header__nav">
                <ul>
                    <li><a href={ADMIN_MAIN} className="nav-link link-main active">Главная</a></li>
                    <li><a href={ADMIN_PROFILE} className="link-profile">Профиль</a></li>
                    <li><a href={ADMIN_EMPLOYEES} className="link-employees">Сотрудники</a></li>
                    <li><a href={ADMIN_GROUPS} className="link-groups">Группы терминалов</a></li>
                    <li><a href={ADMIN_TERMINALS} className="link-terminals">Терминалы</a></li>
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
                <a onClick={e=> {e.preventDefault(); logout()}} href="" className="nav-link link-power">Выход</a>
            </div>
        </React.Fragment>
    )
}

export default AdminMenu