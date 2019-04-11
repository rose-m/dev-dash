import React, {useContext, useState} from 'react';
import './App.css';
import {createGlobalState} from "./global/context";
import {Global} from './global';
import {GlobalAPI, GlobalState, IntegrationStatus} from "./global/models";
import {Dashboard} from "./components";

function App(): React.ReactElement {
    const global = useContext(Global);
    const [globalState, setGlobalState] = useState(createGlobalState());
    const interceptGlobal = createGlobal();

    global.updateState(globalState);

    return (
        <Global.Provider value={interceptGlobal}>
            <Dashboard/>
        </Global.Provider>
    );

    function createGlobal(): GlobalAPI {
        return {
            getStatus(): IntegrationStatus {
                return global.getStatus();
            },
            setStatus(integration: string, status: IntegrationStatus): boolean {
                const changed = global.setStatus(integration, status);
                if (changed) {
                    setGlobalState(global.copyState());
                }
                return changed;
            },
            updateState(state: GlobalState): void {
                throw new Error('forbidden');
            },
            copyState(): GlobalState {
                throw new Error('forbidden');
            }
        }
    }
}

export default App;
