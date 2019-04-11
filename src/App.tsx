import React from 'react';
import './App.css';
import {CircleFailingBuilds} from "./integrations/circleci";

function App(): React.ReactElement {
    return (
        <div className={'app-dashboard'}>
            <header className={'app-dashboard__header'}>
                <h1>Developer Dashboard</h1>
            </header>

            <div className={'app-dashboard__integrations'}>
                <CircleFailingBuilds username={'collaborationFactory'}
                                     project={'cplace'}/>
            </div>
        </div>
    );
}

export default App;
