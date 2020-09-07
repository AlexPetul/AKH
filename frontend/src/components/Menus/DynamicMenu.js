import React from 'react';
import changeLanguage from "../../services/changeLanguage";


function changeIconHover(index, onHover=true) {
    let link = document.getElementsByClassName('nav-link');
    let clearLink = null;
    for (let ind = 0; ind < link.length; ind++) {
        if ((Number(link[ind].getAttribute('index')) === index)
            && (link[ind].getAttribute('href') === window.location.pathname)) {
            clearLink = link[ind];
            break;
        }
    }

    if (clearLink === null) {
        let plainIcon = document.getElementById('ic_id__' + index);
        let hoverIcon = document.getElementById('ic_hover_id__' + index);
        plainIcon.style.display = onHover ? 'none' : 'inline-block';
        hoverIcon.style.display = onHover ? 'inline-block' : 'none';
        document.querySelectorAll("a[index='" + index + "']")[0].style.color = onHover ? '#4F78E0' : '#787D89';
    }
}


function DynamicMenu() {
    return (
        <React.Fragment>
            <div className="header__nav">
                <ul>
                    {window.menus.map((menuItem, index) =>
                        menuItem.is_show ?
                        <li key={index} onMouseLeave={event => {
                            event.preventDefault();
                            changeIconHover(index, false);
                        }} onMouseOver={event => {
                            event.preventDefault();
                            changeIconHover(index)
                        }}>
                            <img className='icon-plain' id={"ic_id__" + index}
                                 src={"/media/original_images/" + menuItem.icon_path} alt="2"/>
                            <img className="icon-hover" id={"ic_hover_id__" + index}
                                 src={"/media/original_images/" + menuItem.icon_hover_path} alt="2"/>
                            <a index={index} href={menuItem.redirect_path} style={{'paddingLeft': 10}}
                               className="nav-link">{window.languageId === 1 ? menuItem.menu_label : menuItem.menu_label_en}</a>
                        </li> : null
                    )}
                    <li>
                        <a className={`nav-link lang-select ${window.languageId === 1 ? 'lang-rus' : 'lang-eng'}`}
                           href="" onClick={e => {
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
        </React.Fragment>
    )
}

export default DynamicMenu;