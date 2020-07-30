import React, {Component} from 'react'
import Logo from '../components/Logo'
import BurgerMenu from '../components/Menus/BurgerMenu'
import MenuConfigContainer from "./MenuConfigContainer";


class MainNavigationContainer extends Component {
    menuStyle = "header__mobile";
    burgerStyle = "header__btn";

    constructor() {
        super()
        this.state = {
            showMenu: false
        }
    }

    handleClick = () => {
        if (!this.state.showMenu) {
            this.setState(
                {showMenu: true}
            )
        } else {
            this.setState(
                {showMenu: false}
            )
        }
    };

    render() {
        return (
            <div className="header">
                <div className="container">
                    <Logo/>
                    <MenuConfigContainer className={!this.state.showMenu ? this.menuStyle : `${this.menuStyle} active`}/>
                    <BurgerMenu className={!this.state.showMenu ? this.burgerStyle : `${this.burgerStyle} active`} onClick={this.handleClick}/>
                </div>
            </div>
        )
    }
}

export default MainNavigationContainer;