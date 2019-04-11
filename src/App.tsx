import React from 'react';
import './App.css';
import {CircleFailingBuilds} from "./integrations/circleci";

function App(): React.ReactElement {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Developer Dashboard</h1>
            </header>

            <div>
                <CircleFailingBuilds username={'collaborationFactory'} project={'cplace'}/>
            </div>
        </div>
    );
}

export default App;
