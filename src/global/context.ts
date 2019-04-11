import {GlobalAPI, GlobalState, IntegrationStatus} from "./models";


class DefaultGlobalContext implements GlobalAPI {
    private state: GlobalState = createGlobalState();

    constructor() {
    }

    updateState(state: GlobalState): void {
        this.state = state;
    }

    copyState(): GlobalState {
        return {...this.state};
    }

    setStatus(integration: string, status: IntegrationStatus): boolean {
        const old = this.state.integrations[integration];
        this.state.integrations[integration] = status;
        return old !== status;
    }

    getStatus(): IntegrationStatus {
        let overall: IntegrationStatus = 'success';
        Object.keys(this.state.integrations).forEach(i => {
            const status = this.state.integrations[i];
            if (status === 'error') {
                overall = 'error';
            } else if (status === 'warning' && overall === 'success') {
                overall = 'warning';
            }
        });
        return overall;
    }
}

export function createGlobalState() {
    return {
        integrations: {}
    }
}

export const GlobalContext = new DefaultGlobalContext();
