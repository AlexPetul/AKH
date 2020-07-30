import React from 'react';


function BurgerMenu(props) {
    return (
        <div className={props.className} onClick={props.onClick}>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
    )
}

export default BurgerMenu;