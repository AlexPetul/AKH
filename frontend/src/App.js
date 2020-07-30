import React from 'react'
import MainNavigationContainer from './containers/MainNavigationContainer'
import ContentContainer from './containers/ContentContainer'
import {BrowserRouter} from 'react-router-dom'


function App() {
    return (
        <BrowserRouter>
            <div className="wrapper">
                <MainNavigationContainer/>
                <ContentContainer/>
            </div>
        </BrowserRouter>
    )
}

export default App;
