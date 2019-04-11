export type IntegrationStatus = 'error' | 'warning' | 'success';

export interface GlobalAPI {
    getStatus(): IntegrationStatus;

    setStatus(integration: string, status: IntegrationStatus): boolean;

    updateState(state: GlobalState): void;

    copyState(): GlobalState;
}

export interface GlobalState {
    integrations: Record<string, IntegrationStatus>;
}
