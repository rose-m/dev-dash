import {BuildDetails, BuildFilter, CircleAPI} from "./model";

class DefaultCircleAPI implements CircleAPI {
    private static readonly BASE_URL = 'https://circleci.com/api/v1.1';

    private token: string = '';

    constructor() {
    }

    public setToken(token: string): void {
        this.token = token;
    }

    public getProjectBuilds(user: string, project: string, filter?: BuildFilter): Promise<BuildDetails[]> {
        const endpoint = `/project/github/${user}/${project}`;
        const params: Record<string, any> = {};
        if (filter) {
            params['filter'] = filter;
        }
        return this.getApi(endpoint, params);
    }

    public async getProjectBranchBuilds(user: string, project: string, branch: string, filter?: BuildFilter): Promise<BuildDetails[]> {
        const endpoint = `/project/github/${user}/${project}/tree/${branch}`;
        const params: Record<string, any> = {};
        if (filter) {
            params['filter'] = filter;
        }
        return this.getApi(endpoint, params);
    }

    private async getApi(endpoint: string, queryParams?: Record<string, any>): Promise<any> {
        const url = new URL(DefaultCircleAPI.getUrl(endpoint));

        if (queryParams) {
            Object.keys(queryParams).forEach(k => {
                url.searchParams.append(k, queryParams[k]);
            });
        }

        if (this.token) {
            url.searchParams.append('circle-token', this.token);
        } else {
            console.warn('missing CircleCI token!');
        }

        console.debug('[CircleAPI] Fetching request:', url);
        const response = await fetch(url.toString());
        console.debug('[CircleAPI] Got response:', response);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
        }
        return response.json();
    }

    private static getUrl(endpoint: string): string {
        return this.BASE_URL + (endpoint[0] === '/' ? endpoint : `/${endpoint}`);
    }
}

export const Circle = new DefaultCircleAPI();
